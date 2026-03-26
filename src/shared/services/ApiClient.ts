import axios from "axios";
import { AuthHelper } from "@/shared/features/auth/helpers/AuthHelper";

const createApiClient = (baseURL: string) => {
  const api = axios.create({ baseURL });

  // Request interceptor
  api.interceptors.request.use((config) => {
    const accessToken = AuthHelper.getAccessToken();
    if (accessToken) {
      config.headers._at = accessToken;
    }
    return config;
  });

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      throw error;
    }
  );

  return api;
};

export const userApiClient = createApiClient(
  import.meta.env.VITE_USER_SERVICE_BASE_URL || ""
);
export const masterDataApiClient = createApiClient(
  import.meta.env.VITE_MASTER_DATA_SERVICE_BASE_URL || ""
);
export const siteApiClient = createApiClient(
  import.meta.env.VITE_SITE_SERVICE_BASE_URL || ""
);
export const supplierApiClient = createApiClient(
  import.meta.env.VITE_SUPPLIER_SERVICE_BASE_URL || ""
);
export const workerApiClient = createApiClient(
  import.meta.env.VITE_WORKER_SERVICE_BASE_URL || ""
);