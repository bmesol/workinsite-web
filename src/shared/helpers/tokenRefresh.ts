/**
 * Shared token-refresh entry point used by ApiHelper's 401 interceptor,
 * SessionWatcher, and AuthService.restoreSession.
 *
 * Two levels of concurrency protection:
 *
 * 1. In-flight promise (same-tab deduplication)
 *    If refreshTokensShared() is called while a refresh is already running
 *    in this tab, the new caller joins the existing Promise — no duplicate
 *    /auth/refresh request is sent.
 *
 * 2. Web Locks API — navigator.locks (cross-tab serialisation)
 *    Only one browser tab at a time executes the actual HTTP call.
 *    Inside the lock the AT is re-read from localStorage first.  If another
 *    tab already completed a refresh, the fresh AT is returned immediately
 *    without any network call.
 *    Requires a secure context (HTTPS or localhost).  Gracefully falls back
 *    to the in-flight-promise path when navigator.locks is unavailable.
 *
 * TEMP DEBUG — the console.debug lines are intentionally left in place so
 * the refresh-race fix can be verified in the browser console.  Remove them
 * once confirmed.
 */

import axios from "axios";
import type { AxiosError } from "axios";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";

const LOCK_NAME = "workinsite_token_refresh";
const LAST_REFRESH_KEY = "_last_refresh_at";
const THROTTLE_MS = 20_000;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** In-flight promise — same-tab deduplication. */
let activeRefreshPromise: Promise<AuthTokens | null> | null = null;

const getAcceptLanguage = (): string =>
  localStorage.getItem("APP_LANGUAGE") === "ta" ? "ta" : "en-GB";

/**
 * Minimal Axios instance used only for POST /auth/refresh.
 * Does NOT carry auth headers (refresh endpoint does not need them).
 * Defined at module level so the instance is reused across calls.
 */
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Perform a token refresh with cross-caller and cross-tab protection.
 *
 * @param failedAccessToken  The AT that triggered this refresh — either the
 *   token attached to a request that received a 401 (clock skew / server-side
 *   invalidation) or the token that SessionWatcher found expiring soon.
 *
 *   Inside the lock, the early-return that skips the network call only fires
 *   when the stored AT is valid AND differs from `failedAccessToken`.  If they
 *   match, the caller's token is stale (or about to expire) even though its
 *   exp says otherwise, so the network call is forced.
 *
 *   Omit (or pass undefined) when the caller does not have a specific AT to
 *   compare against; the standard exp-based validity check then applies.
 *
 * Returns AuthTokens on success (freshly fetched or already-valid in storage).
 * Returns null when no refresh token is stored.
 * Throws the AxiosError from /auth/refresh on HTTP failure that is NOT
 * resolved by re-reading storage; callers inspect .response?.status to decide
 * whether to force-logout.
 */
export const refreshTokensShared = (
  failedAccessToken?: string,
  bypassThrottle?: boolean,
): Promise<AuthTokens | null> => {
  if (activeRefreshPromise) {
    console.debug(
      "[Auth DEBUG] refreshTokensShared: joining in-flight refresh (same tab)",
    );
    return activeRefreshPromise;
  }

  /**
   * Core work — runs inside the Web Lock when available.
   *
   * failedAccessToken is captured from the outer scope via closure.
   */
  const doRefresh = async (): Promise<AuthTokens | null> => {
    const currentAt = AuthHelper.getAccessToken();

    // Skip the network call only when the stored AT is valid AND it is NOT
    // the same token the caller flagged as failed or expiring.
    // • currentAt !== failedAccessToken → another tab already rotated it.
    // • failedAccessToken is undefined → no specific token was flagged;
    //   standard exp check applies (legacy / restoreSession fast-path).
    if (
      AuthHelper.isAccessTokenValid(currentAt) &&
      currentAt !== failedAccessToken
    ) {
      console.debug(
        "[Auth DEBUG] refreshTokensShared: AT already valid — skipping network call (refreshed by another tab/caller)",
      );
      return {
        accessToken: currentAt!,
        refreshToken: AuthHelper.getRefreshToken() ?? "",
      };
    }

    // Throttle: if any tab completed a refresh within the last 20 s and the
    // AT is still valid, return the stored tokens without a network call.
    // Skipped when bypassThrottle = true (401 interceptor), because the
    // server just rejected this exact AT so we must attempt a real refresh.
    if (!bypassThrottle && AuthHelper.isAccessTokenValid(currentAt)) {
      const lastRaw = localStorage.getItem(LAST_REFRESH_KEY);
      if (lastRaw && Date.now() - parseInt(lastRaw, 10) < THROTTLE_MS) {
        console.debug(
          "[Auth DEBUG] refreshTokensShared: throttled — a refresh completed recently, returning stored tokens",
        );
        return {
          accessToken: currentAt!,
          refreshToken: AuthHelper.getRefreshToken() ?? "",
        };
      }
    }

    const rt = AuthHelper.getRefreshToken();
    if (!rt) {
      console.debug(
        "[Auth DEBUG] refreshTokensShared: no refresh token in storage",
      );
      return null;
    }

    console.debug(
      "[Auth DEBUG] refreshTokensShared: sending POST /auth/refresh",
    );

    try {
      const response = await refreshApi.post(
        "/auth/refresh",
        { refreshToken: rt },
        { headers: { "Accept-Language": getAcceptLanguage() } },
      );

      const newTokens: AuthTokens = {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };

      if (!newTokens.accessToken || !newTokens.refreshToken) {
        throw new Error("Refresh response missing tokens");
      }

      // Store both — backend always rotates both tokens on every use.
      AuthHelper.setAccessToken(newTokens.accessToken);
      AuthHelper.setRefreshToken(newTokens.refreshToken);
      localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));

      console.debug(
        "[Auth DEBUG] refreshTokensShared: tokens stored, refresh complete",
      );

      return newTokens;
    } catch (error) {
      const status = (error as AxiosError).response?.status;

      // On 401/403: the server rejected our RT.  Before propagating the
      // error, check whether another tab rotated the RT while our request
      // was in flight.  We detect this by comparing the RT we sent against
      // whatever is now in localStorage.  If they differ, another tab won
      // the rotation — return its stored tokens.  If they are the same, the
      // rejection is genuine (revoked RT); rethrow so callers call forceLogout.
      if (status === 401 || status === 403) {
        const storedRt = AuthHelper.getRefreshToken();
        if (storedRt !== rt) {
          const freshAt = AuthHelper.getAccessToken();
          if (AuthHelper.isAccessTokenValid(freshAt)) {
            console.debug(
              "[Auth DEBUG] doRefresh: 401/403 on /auth/refresh but another tab rotated the RT — returning stored tokens",
            );
            return {
              accessToken: freshAt!,
              refreshToken: storedRt ?? "",
            };
          }
        }
      }

      // Propagate — callers decide whether to force-logout based on status.
      throw error;
    }
  };

  const execute = async (): Promise<AuthTokens | null> => {
    // navigator.locks: origin-scoped mutex available in Chrome 69+,
    // Firefox 96+, Safari 15.4+ — but ONLY in secure contexts (HTTPS /
    // localhost).  On plain HTTP it is undefined.
    if (
      typeof navigator !== "undefined" &&
      "locks" in navigator &&
      navigator.locks
    ) {
      console.debug(
        "[Auth DEBUG] refreshTokensShared: acquiring Web Lock",
        LOCK_NAME,
      );
      // navigator.locks.request is typed as Promise<any>; two-step cast is
      // needed because TS 5.x infers Promise<Promise<T>> before any cast.
      return navigator.locks.request(
        LOCK_NAME,
        doRefresh,
      ) as unknown as Promise<AuthTokens | null>;
    }

    // Fallback for browsers without Web Locks (HTTP, older browsers).
    // Same-tab deduplication via activeRefreshPromise still applies.
    console.debug(
      "[Auth DEBUG] refreshTokensShared: Web Locks unavailable, running without cross-tab lock",
    );
    return doRefresh();
  };

  activeRefreshPromise = execute().finally(() => {
    activeRefreshPromise = null;
  });

  return activeRefreshPromise;
};
