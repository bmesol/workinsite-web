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
import { AuthService } from "@/shared/features/auth/services/AuthService";
import { useLoading } from "@/shared/hooks/useLoading";

const apiCache = new Map<string, AxiosInstance>();

/**
 * Prevent several simultaneous 401 responses from
 * triggering several refresh API calls.
 */
let isRefreshing = false;

let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (
  token: string | null,
  error: unknown = null,
) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  });

  pendingQueue = [];
};

/**
 * Prevent multiple logout redirects at the same time.
 */
let isLoggingOut = false;

const forceLogout = () => {
  if (isLoggingOut) {
    return;
  }

  isLoggingOut = true;

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
       * Normally login/refresh use AuthService's own Axios instance,
       * so they shouldn't arrive here.
       *
       * This guard is retained for safety.
       */
      if (
        url.includes("/auth/login") ||
        url.includes("/auth/refresh")
      ) {
        forceLogout();
        return Promise.reject(error);
      }

      /*
       * If this request has ALREADY been retried after a successful
       * refresh and still gets a 401, don't refresh forever.
       *
       * The new access token is not accepted by the backend,
       * so end the authentication session.
       */
      if (originalRequest._retry) {
        forceLogout();
        return Promise.reject(error);
      }

      /**
       * A refresh request is already running because another API
       * request received 401 first.
       *
       * Wait for that refresh instead of making another refresh call.
       */
      if (isRefreshing) {
        return new Promise<string>(
          (resolve, reject) => {
            pendingQueue.push({
              resolve,
              reject,
            });
          },
        ).then((newToken) => {
          originalRequest._retry = true;

          setAuthenticationHeaders(
            originalRequest,
            newToken,
          );

          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken =
          AuthHelper.getRefreshToken();

        /*
         * If there is no refresh token, there is nothing
         * the frontend can use to recover the session.
         */
        if (!refreshToken) {
          flushQueue(
            null,
            new Error("No refresh token stored"),
          );

          forceLogout();

          return Promise.reject(
            new Error("No refresh token stored"),
          );
        }

        /**
         * POST /auth/refresh
         *
         * Request:
         *
         * {
         *   refreshToken: "..."
         * }
         *
         * AuthService automatically sends:
         *
         * Accept-Language: ta | en-GB
         */
        const newTokens =
          await AuthService.refreshAccessToken(
            refreshToken,
          );

        if (
          !newTokens.accessToken ||
          !newTokens.refreshToken
        ) {
          throw new Error(
            "Refresh response did not contain both tokens",
          );
        }

        /**
         * Backend rotates both tokens,
         * therefore BOTH must be replaced.
         */
        AuthHelper.setAccessToken(
          newTokens.accessToken,
        );

        AuthHelper.setRefreshToken(
          newTokens.refreshToken,
        );

        /**
         * Give the new access token to every API call
         * waiting behind this refresh operation.
         */
        flushQueue(newTokens.accessToken);

        /**
         * Retry the original request using
         * the newly generated access token.
         */
        setAuthenticationHeaders(
          originalRequest,
          newTokens.accessToken,
        );

        return api(originalRequest);
      } catch (refreshError) {
        flushQueue(null, refreshError);

        /*
         * The access token was already confirmed expired (backend returned 401
         * on the original request). If the refresh attempt also fails for any
         * reason — rejected token, network error, server error — we cannot
         * recover the session, so always redirect to sign-in.
         */
        forceLogout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
};