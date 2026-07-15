// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const AuthService = {
//   login: async (phoneNumber: string, pin: string): Promise<string> => {
//     try {
//       const response = await api.post("/auth/login", {
//         phone: phoneNumber,
//         password: pin,
//       });

//       return response.data.accessToken;
//     } catch (error: any) {
//       throw new Error(
//         error.response?.data?.message || "Invalid phone number or PIN"
//       );
//     }
//   },
// };

// export { AuthService };


import axios from "axios";
import type { AxiosResponse } from "axios";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AuthService = {
  login: async (phoneNumber: string, pin: string): Promise<AuthTokens> => {
    try {
      const response: AxiosResponse<AuthTokens> = await api.post("/auth/login", {
        phone: phoneNumber,
        password: pin,
      });

      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Invalid phone number or PIN"
      );
    }
  },

  refreshAccessToken: async (refreshToken: string): Promise<AuthTokens> => {
    // Note: deliberately not caught/wrapped here — ApiHelper needs the raw
    // error to distinguish "refresh failed, log out" from other error types.
    const response: AxiosResponse<AuthTokens> = await api.post("/auth/refresh", {
      refreshToken,
    });

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  },
};

export { AuthService };