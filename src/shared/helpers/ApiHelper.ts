// import axios from "axios";
// import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios"; 
// import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
// import { useLoading } from "@/shared/hooks/useLoading";

// const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
//   const loading = useLoading();
//   let isLoading = true;

//   // Create an Axios instance
//   const api: AxiosInstance = axios.create({
//     baseURL,
//   });

//   // Add a request interceptor to add access token to each request and show loading indicator
//   api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     if (withCredential) {
//       const accessToken = AuthHelper.getAccessToken();
//       if (accessToken) {
//         config.headers._at = accessToken;
//       }
//     }
//     if (isLoading) loading.show();
//     return config;
//   });

//   // Add a response interceptor to hide loading indicator
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

//   // Define methods for making API requests
//   const get = (url: string, setIsLoading?: boolean, config?: InternalAxiosRequestConfig) => {
//     if (setIsLoading !== undefined) isLoading = setIsLoading;
//     return api.get(url, config);
//   };

//   const post = (url: string, data?: any, config?: InternalAxiosRequestConfig) => {
//     return api.post(url, data, config);
//   };

//   const put = (url: string, data?: any, config?: InternalAxiosRequestConfig) => {
//     return api.put(url, data, config);
//   };

//   const deleteRequest = (url: string, config?: InternalAxiosRequestConfig) => {
//     return api.delete(url, config);
//   };

//   // Return the API methods as an object
//   return {
//     get,
//     post,
//     put,
//     delete: deleteRequest,
//   };
// };

// export { useAPIHelper };


import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";
import { useLoading } from "@/shared/hooks/useLoading";

const useAPIHelper = (baseURL: string, withCredential: boolean = true) => {
  const loading = useLoading();
  let isLoading = true;

  const api: AxiosInstance = axios.create({
    baseURL,
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (withCredential) {
      const accessToken = AuthHelper.getAccessToken();
      if (accessToken) {
        config.headers._at = accessToken;
      }
    }
    if (isLoading) loading.show();
    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse<any>) => {
      loading.hide();
      return response;
    },
    (error) => {
      loading.hide();
      throw error;
    }
  );

  // ✅ InternalAxiosRequestConfig → AxiosRequestConfig (accepts plain objects like { headers: {...} })
  const get = (url: string, setIsLoading?: boolean, config?: AxiosRequestConfig) => {
    if (setIsLoading !== undefined) isLoading = setIsLoading;
    return api.get(url, config);
  };

  const post = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.post(url, data, config);
  };

  const put = (url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.put(url, data, config);
  };

  const deleteRequest = (url: string, config?: AxiosRequestConfig) => {
    return api.delete(url, config);
  };

  return {
    get,
    post,
    put,
    delete: deleteRequest,
  };
};

export { useAPIHelper };