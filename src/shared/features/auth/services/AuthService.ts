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
   * → continue immediately.
   *
   * Scenario 2:
   * Access token expired but refresh token exists
   * → request new tokens.
   *
   * Scenario 3:
   * No refresh token / refresh token expired
   * → authentication fails.
   */
  restoreSession: async (): Promise<boolean> => {
    const accessToken = AuthHelper.getAccessToken();

    /*
     * Access token still valid.
     */
    if (AuthHelper.isAccessTokenValid(accessToken)) {
      return true;
    }

    const refreshToken = AuthHelper.getRefreshToken();

    /*
     * No refresh token means there is no recoverable session.
     */
    if (!refreshToken) {
      AuthHelper.clearAuthData();
      return false;
    }

    try {
      /*
       * Access token is expired/missing,
       * but the refresh token still exists.
       */
      const newTokens =
        await AuthService.refreshAccessToken(refreshToken);

      if (
        !newTokens.accessToken ||
        !newTokens.refreshToken
      ) {
        throw new Error(
          "Refresh response did not contain both tokens",
        );
      }

      /*
       * Store BOTH because backend rotates refresh tokens.
       */
      AuthHelper.setAccessToken(newTokens.accessToken);
      AuthHelper.setRefreshToken(newTokens.refreshToken);

      return true;
    } catch (error) {
      const axiosError = error as AxiosError;

      const status = axiosError.response?.status;

      /*
       * Only clear the session when the backend tells us
       * the refresh credentials are invalid/unauthorized.
       */
      if (status === 401 || status === 403) {
        AuthHelper.clearAuthData();
      }

      /*
       * A network failure or temporary server error should NOT
       * automatically destroy the 7-day refresh token.
       */
      return false;
    }
  },
};

export { AuthService };