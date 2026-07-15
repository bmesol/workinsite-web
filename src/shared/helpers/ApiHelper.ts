// import axios from "axios";
// import type {
//   AxiosInstance,
//   AxiosResponse,
//   AxiosRequestConfig,
//   InternalAxiosRequestConfig,
// } from "axios";
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { useLoading } from "@/shared/hooks/useLoading";

// const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
//   const loading = useLoading();
//   let isLoading = true;

//   const api: AxiosInstance = axios.create({
//     baseURL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   // ✅ FIX 2: Correct Authorization header
//   api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   if (withCredential) {
//     const accessToken = AuthHelper.getAccessToken();

//     console.log("TOKEN 👉", accessToken);

//     if (accessToken) {
//       (config.headers as any).Authorization = `Bearer ${accessToken}`; 
//       (config.headers as any)._at = accessToken; 
//     }
//   }

//   if (isLoading) loading.show();
//   return config;
// });

//   // Response interceptor
//   api.interceptors.response.use(
//     (response: AxiosResponse<any>) => {
//       loading.hide();
//       return response;
//     },
//     (error) => {
//       loading.hide();
//       throw error;
//     }
//   );

//   const get = (
//     url: string,
//     setIsLoading?: boolean,
//     config?: AxiosRequestConfig
//   ) => {
//     if (setIsLoading !== undefined) isLoading = setIsLoading;
//     return api.get(url, config);
//   };

//   const post = (
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ) => {
//     return api.post(url, data, config);
//   };

//   const put = (
//     url: string,
//     data?: any,
//     config?: AxiosRequestConfig
//   ) => {
//     return api.put(url, data, config);
//   };

//   const deleteRequest = (url: string, config?: AxiosRequestConfig) => {
//     return api.delete(url, config);
//   };

//   return {
//     get,
//     post,
//     put,
//     delete: deleteRequest,
//   };
// };

// export { useAPIHelper };



import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { AuthService } from "@/shared/features/auth/services/AuthService";
import { useLoading } from "@/shared/hooks/useLoading";

const apiCache = new Map<string, AxiosInstance>();

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (token: string | null, error: unknown = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  pendingQueue = [];
};

let isLoggingOut = false;

const forceLogout = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  try {
    AuthHelper.logout(); // already redirects via window.location.href
  } finally {
    isLoggingOut = false;
  }
};

function getApiInstance(baseURL: string, withCredential: boolean): AxiosInstance {
  const cacheKey = `${baseURL}|${withCredential}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

 api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (withCredential) {
    const accessToken = AuthHelper.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers._at = accessToken;
    }
  }
  return config;
});

  api.interceptors.response.use(
    (response: AxiosResponse<any>) => response,
    async (error) => {
      const status = error.response?.status;
      const originalRequest = error.config;
      const url: string = originalRequest?.url ?? "";

      if (status === 401) {
        if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
          forceLogout();
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          });
        }

        isRefreshing = true;

        try {
          const refreshToken = AuthHelper.getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token stored");
          }

          const newTokens = await AuthService.refreshAccessToken(refreshToken);
          AuthHelper.setAccessToken(newTokens.accessToken);
          AuthHelper.setRefreshToken(newTokens.refreshToken);

          flushQueue(newTokens.accessToken);

          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          flushQueue(null, refreshError);
          forceLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  apiCache.set(cacheKey, api);
  return api;
}

const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
  const loading = useLoading();

  const api = getApiInstance(baseURL, withCredential);

  const withLoader = async <T>(showLoader: boolean, request: () => Promise<T>): Promise<T> => {
    if (showLoader) loading.show();
    try {
      return await request();
    } finally {
      if (showLoader) loading.hide();
    }
  };

  const get = (url: string, showLoader: boolean = true, config?: AxiosRequestConfig) =>
    withLoader(showLoader, () => api.get(url, config));

  const post = (url: string, data?: any, config?: AxiosRequestConfig, showLoader: boolean = true) =>
    withLoader(showLoader, () => api.post(url, data, config));

  const put = (url: string, data?: any, config?: AxiosRequestConfig, showLoader: boolean = true) =>
    withLoader(showLoader, () => api.put(url, data, config));

  const deleteRequest = (url: string, config?: AxiosRequestConfig, showLoader: boolean = true) =>
    withLoader(showLoader, () => api.delete(url, config));

  return { get, post, put, delete: deleteRequest };
};

export { useAPIHelper, getApiInstance };