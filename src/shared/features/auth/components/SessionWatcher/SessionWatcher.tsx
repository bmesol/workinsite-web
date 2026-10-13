import { useEffect } from "react";
import type { AxiosError } from "axios";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { forceLogout } from "@/shared/helpers/ApiHelper";
import { refreshTokensShared } from "@/shared/helpers/tokenRefresh";

/**
 * Matches the mobile app's SessionWatcher (src/session/SessionWatcher.tsx).
 *
 * Forces a real /auth/refresh on every tick (every 30 s and on tab visibility).
 * Always passing currentAt as failedAccessToken ensures the Web Lock's
 * early-return does not suppress the network call when the AT is still valid
 * but the RT was revoked on the server (other-device login).
 *
 * Purpose:
 * 1. Detects session revocation by another device within ~30 seconds
 *    (server returns 401/403 on /auth/refresh → forceLogout).
 * 2. Keeps the AT fresh for ApiClient.ts services (no 401 handling).
 *
 * Multi-tab cost: refreshTokensShared throttles to one real network call per
 * 20 s across all tabs (via localStorage "_last_refresh_at"), so N tabs open
 * still produce only ~1 refresh every 20-30 s, not N.
 *
 * Concurrency:
 * refreshTokensShared() handles same-tab deduplication (in-flight promise)
 * and cross-tab serialisation (Web Locks API) internally.
 *
 * TEMP DEBUG — console.debug lines are intentional; remove once the
 * refresh-race fix is confirmed in production.
 */

const POLL_INTERVAL_MS = 30_000;

const SessionWatcher = () => {
  useEffect(() => {
    const checkSession = async () => {
      console.debug("[Auth DEBUG] SessionWatcher: checkSession triggered");

      /*
       * Read current AT before the async call so we can detect whether
       * this tab had a session at the start of this tick (for the null
       * result guard below).
       */
      const currentAt = AuthHelper.getAccessToken() ?? undefined;

      try {
        /*
         * Always pass currentAt as failedAccessToken so that inside the
         * Web Lock, doRefresh does NOT short-circuit via the standard
         * early-return when the AT is fresh — a fresh AT with a revoked
         * RT must reach the server.  The 20 s throttle in tokenRefresh.ts
         * prevents redundant network calls across tabs.
         */
        const result = await refreshTokensShared(currentAt);

        if (result) {
          console.debug(
            "[Auth DEBUG] SessionWatcher: refresh succeeded (or throttled — AT still valid)",
          );
        } else if (currentAt !== undefined) {
          /*
           * This tab had an AT before this tick but the RT is now gone.
           * Another device logged in (revoking the RT) or another tab
           * already called forceLogout and cleared storage.
           */
          console.debug(
            "[Auth DEBUG] SessionWatcher: no refresh token — session cleared elsewhere, forcing logout",
          );
          forceLogout("session-cleared-elsewhere");
        } else {
          console.debug(
            "[Auth DEBUG] SessionWatcher: no tokens in storage",
          );
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status;

        if (status === 401 || status === 403) {
          /*
           * Server explicitly rejected the refresh token.
           * Another device has likely logged in, revoking this session.
           */
          console.debug(
            "[Auth DEBUG] SessionWatcher: refresh rejected by server",
            { status },
            "— forcing logout",
          );
          forceLogout(`session-watcher-${status}`);
        } else {
          /*
           * Network error, timeout, or 5xx.
           * A flaky connection must NOT log the user out.
           */
          console.debug(
            "[Auth DEBUG] SessionWatcher: refresh failed (transient), ignoring",
            { status, error },
          );
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.debug(
          "[Auth DEBUG] SessionWatcher: tab became visible — triggering refresh",
        );
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(checkSession, POLL_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  return null;
};

export { SessionWatcher };
