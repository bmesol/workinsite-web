// import axios from "axios";
// import type {
//   AxiosInstance,
//   AxiosResponse,
//   AxiosRequestConfig,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { AuthService } from "@/shared/features/auth/services/AuthService";
// import { useLoading } from "@/shared/hooks/useLoading";

// const apiCache = new Map<string, AxiosInstance>();

// let isRefreshing = false;
// let pendingQueue: Array<{
//   resolve: (token: string) => void;
//   reject: (err: unknown) => void;
// }> = [];

// const flushQueue = (token: string | null, error: unknown = null) => {
//   pendingQueue.forEach(({ resolve, reject }) => {
//     if (token) resolve(token);
//     else reject(error);
//   });
//   pendingQueue = [];
// };

// let isLoggingOut = false;

// const forceLogout = () => {
//   if (isLoggingOut) return;
//   isLoggingOut = true;
//   try {
//     AuthHelper.logout(); // already redirects via window.location.href
//   } finally {
//     isLoggingOut = false;
//   }
// };

// function getApiInstance(baseURL: string, withCredential: boolean): AxiosInstance {
//   const cacheKey = `${baseURL}|${withCredential}`;
//   const cached = apiCache.get(cacheKey);
//   if (cached) return cached;

//   const api = axios.create({
//     baseURL,
//     headers: { "Content-Type": "application/json" },
//   });

//  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   if (withCredential) {
//     const accessToken = AuthHelper.getAccessToken();
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//       config.headers._at = accessToken;
//     }
//   }
//   return config;
// });

//   api.interceptors.response.use(
//     (response: AxiosResponse<any>) => response,
//     async (error) => {
//       const status = error.response?.status;
//       const originalRequest = error.config;
//       const url: string = originalRequest?.url ?? "";

//       if (status === 401) {
//         if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
//           forceLogout();
//           return Promise.reject(error);
//         }

//         if (isRefreshing) {
//           return new Promise<string>((resolve, reject) => {
//             pendingQueue.push({ resolve, reject });
//           }).then((newToken) => {
//             originalRequest.headers.Authorization = `Bearer ${newToken}`;
//             return api(originalRequest);
//           });
//         }

//         isRefreshing = true;

//         try {
//           const refreshToken = AuthHelper.getRefreshToken();
//           if (!refreshToken) {
//             throw new Error("No refresh token stored");
//           }

//           const newTokens = await AuthService.refreshAccessToken(refreshToken);
//           AuthHelper.setAccessToken(newTokens.accessToken);
//           AuthHelper.setRefreshToken(newTokens.refreshToken);

//           flushQueue(newTokens.accessToken);

//           originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           flushQueue(null, refreshError);
//           forceLogout();
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return Promise.reject(error);
//     },
//   );

//   apiCache.set(cacheKey, api);
//   return api;
// }

// const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
//   const loading = useLoading();

//   const api = getApiInstance(baseURL, withCredential);

//   const withLoader = async <T>(showLoader: boolean, request: () => Promise<T>): Promise<T> => {
//     if (showLoader) loading.show();
//     try {
//       return await request();
//     } finally {
//       if (showLoader) loading.hide();
//     }
//   };

//   const get = (url: string, showLoader: boolean = true, config?: AxiosRequestConfig) =>
//     withLoader(showLoader, () => api.get(url, config));

//   const post = (url: string, data?: any, config?: AxiosRequestConfig, showLoader: boolean = true) =>
//     withLoader(showLoader, () => api.post(url, data, config));

//   const put = (url: string, data?: any, config?: AxiosRequestConfig, showLoader: boolean = true) =>
//     withLoader(showLoader, () => api.put(url, data, config));

//   const deleteRequest = (url: string, config?: AxiosRequestConfig, showLoader: boolean = true) =>
//     withLoader(showLoader, () => api.delete(url, config));

//   return { get, post, put, delete: deleteRequest };
// };

// export { useAPIHelper, getApiInstance };



import axios from "axios";

import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { refreshTokensShared } from "@/shared/helpers/tokenRefresh";
import { useLoading } from "@/shared/hooks/useLoading";

const apiCache = new Map<string, AxiosInstance>();

/**
 * Prevent multiple logout redirects from firing concurrently.
 * Module-level; reset automatically on page reload (which forceLogout triggers).
 */
let isLoggingOut = false;

/**
 * Call this whenever the server explicitly confirms the session is dead
 * (401 / 403 on a refresh attempt, or no refresh token available).
 *
 * @param caller - short label shown in the debug log so you can trace which
 *   code path triggered the logout.
 *
 * TEMP DEBUG — console.debug lines are intentional; remove once the
 * refresh-race fix is confirmed in production.
 */
const forceLogout = (caller = "unknown") => {
  console.debug(
    `[Auth DEBUG] forceLogout called — caller: ${caller}`,
  );

  if (isLoggingOut) {
    console.debug(
      "[Auth DEBUG] forceLogout: already in progress, skipping",
    );
    return;
  }

  isLoggingOut = true;

  console.debug(
    "[Auth DEBUG] forceLogout: clearing auth data and redirecting to /",
  );

  AuthHelper.logout();
};

/**
 * Axios request config with our retry marker.
 *
 * _retry ensures that one request cannot enter
 * an endless refresh → retry → 401 → refresh loop.
 */
type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

/**
 * Set all authentication headers consistently.
 */
const setAuthenticationHeaders = (
  config: RetryRequestConfig,
  accessToken: string,
) => {
  config.headers.Authorization =
    `Bearer ${accessToken}`;

  /*
   * Your backend also uses its custom _at header.
   */
  config.headers._at = accessToken;
};

function getApiInstance(
  baseURL: string,
  withCredential: boolean,
): AxiosInstance {
  const cacheKey = `${baseURL}|${withCredential}`;

  const cached = apiCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * REQUEST INTERCEPTOR
   */
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      /*
       * Match current backend Swagger language values.
       */
      const language =
        localStorage.getItem("APP_LANGUAGE");

      config.headers["Accept-Language"] =
        language === "ta" ? "ta" : "en-GB";

      if (withCredential) {
        const accessToken =
          AuthHelper.getAccessToken();

        if (accessToken) {
          setAuthenticationHeaders(
            config as RetryRequestConfig,
            accessToken,
          );
        }
      }

      return config;
    },
  );

  /**
   * RESPONSE INTERCEPTOR
   *
   * TEMP DEBUG — console.debug lines are intentional; remove once the
   * refresh-race fix is confirmed in production.
   */
  api.interceptors.response.use(
    (response: AxiosResponse<any>) => response,

    async (error: AxiosError) => {
      const status = error.response?.status;

      const originalRequest =
        error.config as RetryRequestConfig | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? "";

      /*
       * Only handle authentication failures here.
       */
      if (status !== 401) {
        return Promise.reject(error);
      }

      /*
       * Safety guard: login/refresh use AuthService's own Axios instance
       * and should never reach this interceptor.  If they somehow do,
       * treat it as a genuinely dead session.
       */
      if (
        url.includes("/auth/login") ||
        url.includes("/auth/refresh")
      ) {
        console.debug(
          "[Auth DEBUG] 401 interceptor: 401 on auth endpoint — forcing logout",
          { url },
        );
        forceLogout("401-on-auth-endpoint");
        return Promise.reject(error);
      }

      /*
       * If this request was already retried after a successful refresh and
       * is STILL getting 401, the fresh token itself is rejected by the
       * backend — the session is genuinely dead.
       */
      if (originalRequest._retry) {
        console.debug(
          "[Auth DEBUG] 401 interceptor: retried request still 401 — forcing logout",
        );
        forceLogout("retried-request-still-401");
        return Promise.reject(error);
      }

      /*
       * Mark the request as retried before the async refresh so that if
       * the retry itself returns 401, the guard above catches it.
       */
      originalRequest._retry = true;

      /*
       * Pass the AT that was on the failed request so that inside the Web
       * Lock, doRefresh can distinguish "another tab already refreshed this
       * exact token" from "this token is still current but the server
       * rejected it anyway" (clock skew / server-side invalidation).
       * Without this, doRefresh would see the AT as valid (exp still in the
       * future) and return it unchanged — causing the retry to get 401 again,
       * which triggers forceLogout("retried-request-still-401").
       */
      const failedAt = originalRequest.headers._at as string | undefined;

      console.debug(
        "[Auth DEBUG] 401 interceptor: calling refreshTokensShared",
        { url },
      );

      try {
        /*
         * refreshTokensShared(failedAt):
         *   • deduplicates concurrent callers within this tab via an
         *     in-flight promise,
         *   • serialises across tabs via the Web Locks API,
         *   • re-reads AT inside the lock; skips the network call only when
         *     stored AT is valid AND differs from failedAt (another tab
         *     already refreshed it).
         */
        const newTokens = await refreshTokensShared(failedAt, true);

        if (!newTokens) {
          /*
           * refreshTokensShared returns null only when there is no
           * refresh token in storage — the session is unrecoverable.
           */
          console.debug(
            "[Auth DEBUG] 401 interceptor: no refresh token — forcing logout",
          );
          forceLogout("no-refresh-token");
          return Promise.reject(new Error("No refresh token stored"));
        }

        console.debug(
          "[Auth DEBUG] 401 interceptor: refresh succeeded, retrying original request",
        );

        setAuthenticationHeaders(
          originalRequest,
          newTokens.accessToken,
        );

        return api(originalRequest);
      } catch (refreshError) {
        const refreshStatus =
          (refreshError as AxiosError).response?.status;

        /*
         * Only destroy the session when the server explicitly rejects the
         * refresh token (401 or 403).  Network errors, 5xx, and other
         * transient failures must NOT log the user out — the refresh token
         * is likely still valid and the next user action will retry.
         */
        if (refreshStatus === 401 || refreshStatus === 403) {
          console.debug(
            "[Auth DEBUG] 401 interceptor: refresh rejected by server",
            { refreshStatus },
            "— forcing logout",
          );
          forceLogout(`refresh-rejected-${refreshStatus}`);
        } else {
          console.debug(
            "[Auth DEBUG] 401 interceptor: refresh failed (transient), not forcing logout",
            { refreshStatus, refreshError },
          );
        }

        return Promise.reject(refreshError);
      }
    },
  );

  apiCache.set(cacheKey, api);

  return api;
}

const useAPIHelper = (
  baseURL: string,
  withCredential: boolean = true,
) => {
  const loading = useLoading();

  const api = getApiInstance(
    baseURL,
    withCredential,
  );

  const withLoader = async <T>(
    showLoader: boolean,
    request: () => Promise<T>,
  ): Promise<T> => {
    if (showLoader) {
      loading.show();
    }

    try {
      return await request();
    } finally {
      if (showLoader) {
        loading.hide();
      }
    }
  };

  const get = (
    url: string,
    showLoader: boolean = true,
    config?: AxiosRequestConfig,
  ) =>
    withLoader(showLoader, () =>
      api.get(url, config),
    );

  const post = (
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    showLoader: boolean = true,
  ) =>
    withLoader(showLoader, () =>
      api.post(url, data, config),
    );

  const put = (
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    showLoader: boolean = true,
  ) =>
    withLoader(showLoader, () =>
      api.put(url, data, config),
    );

  const deleteRequest = (
    url: string,
    config?: AxiosRequestConfig,
    showLoader: boolean = true,
  ) =>
    withLoader(showLoader, () =>
      api.delete(url, config),
    );

  return {
    get,
    post,
    put,
    delete: deleteRequest,
  };
};

export {
  useAPIHelper,
  getApiInstance,
  forceLogout,
};