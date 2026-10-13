// import axios from "axios";
// import type { AxiosResponse } from "axios";

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
// }

// const api = axios.create({
//   baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const AuthService = {
//   login: async (phoneNumber: string, pin: string): Promise<AuthTokens> => {
//     try {
//       const response: AxiosResponse<AuthTokens> = await api.post("/auth/login", {
//         phone: phoneNumber,
//         password: pin,
//       });

//       return {
//         accessToken: response.data.accessToken,
//         refreshToken: response.data.refreshToken,
//       };
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Invalid phone number or PIN"
//       );
//     }
//   },

//   refreshAccessToken: async (refreshToken: string): Promise<AuthTokens> => {
//     // Note: deliberately not caught/wrapped here — ApiHelper needs the raw
//     // error to distinguish "refresh failed, log out" from other error types.
//     const response: AxiosResponse<AuthTokens> = await api.post("/auth/refresh", {
//       refreshToken,
//     });

//     return {
//       accessToken: response.data.accessToken,
//       refreshToken: response.data.refreshToken,
//     };
//   },
// };

// export { AuthService };


import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { refreshTokensShared } from "@/shared/helpers/tokenRefresh";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Backend Swagger currently allows:
 *
 * Accept-Language:
 *   ta
 *   en-GB
 *
 * So normalize anything other than Tamil to en-GB.
 */
const getAcceptLanguage = (): string => {
  const language = localStorage.getItem("APP_LANGUAGE");

  if (language === "ta") {
    return "ta";
  }

  return "en-GB";
};

/**
 * Separate Axios instance for authentication endpoints.
 *
 * Important:
 * This instance does NOT add the expired access token.
 *
 * Login and refresh do not need Authorization / _at.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Accept-Language is mandatory according to the backend API.
 */
api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = getAcceptLanguage();

  return config;
});

const AuthService = {
  login: async (
    phoneNumber: string,
    pin: string,
  ): Promise<AuthTokens> => {
    try {
      const response: AxiosResponse<AuthTokens> = await api.post(
        "/auth/login",
        {
          phone: phoneNumber,
          password: pin,
        },
      );

      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Invalid phone number or PIN",
      );
    }
  },

  refreshAccessToken: async (
    refreshToken: string,
  ): Promise<AuthTokens> => {
    /*
     * Backend expects exactly:
     *
     * POST /auth/refresh
     *
     * {
     *   "refreshToken": "..."
     * }
     *
     * Accept-Language is automatically added by the interceptor above.
     */
    const response: AxiosResponse<AuthTokens> = await api.post(
      "/auth/refresh",
      {
        refreshToken,
      },
    );

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },

  /**
   * Called when the application / protected route starts.
   *
   * Scenario 1:
   * Access token is still valid
   * → continue immediately (no network call).
   *
   * Scenario 2:
   * Access token expired but refresh token exists
   * → refreshTokensShared() handles the network call, Web Lock, and
   *   cross-tab deduplication.
   *
   * Scenario 3:
   * No refresh token / refresh token expired or revoked
   * → authentication fails.
   */
  restoreSession: async (): Promise<boolean> => {
    const accessToken = AuthHelper.getAccessToken();

    /*
     * Access token still valid — fast path, no lock needed.
     */
    if (AuthHelper.isAccessTokenValid(accessToken)) {
      return true;
    }

    /*
     * refreshTokensShared() handles:
     *   • no RT in storage  → returns null
     *   • Web Lock          → cross-tab serialisation
     *   • re-read inside lock → skips network call if another tab refreshed
     *   • 401/403 on /auth/refresh with fresh AT in storage → returns stored tokens
     */
    try {
      const newTokens = await refreshTokensShared();

      if (!newTokens) {
        /*
         * No refresh token in storage — session is unrecoverable.
         */
        console.debug(
          "[Auth DEBUG] restoreSession: no refresh token — clearing auth data",
        );
        AuthHelper.clearAuthData();
        return false;
      }

      console.debug(
        "[Auth DEBUG] restoreSession: refresh succeeded",
      );
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      if (status === 401 || status === 403) {
        /*
         * Server explicitly rejected the refresh token —
         * the session is genuinely invalid.
         */
        console.debug(
          "[Auth DEBUG] restoreSession: refresh rejected by server",
          { status },
          "— clearing auth data",
        );
        AuthHelper.clearAuthData();
        return false;
      }

      /*
       * Network failure, server 5xx, or any other transient error.
       * The refresh token is almost certainly still valid; do not
       * destroy it.  Return true so PrivateRoute keeps the user on
       * their current page instead of redirecting to sign-in.
       */
      console.debug(
        "[Auth DEBUG] restoreSession: refresh failed (transient), keeping session",
        { status },
      );
      return true;
    }
  },
};

export { AuthService };