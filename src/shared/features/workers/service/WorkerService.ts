// WorkerService.ts
import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WorkerRequest } from "../DTOs/WorkerProps";

type GetWorkersParams = {
  WorkerName?: string;
  WorkerCategoryId?: number;
};

const useWorkerService = () => {
  const baseUrl = import.meta.env.VITE_SUPPLIER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkers = async (params: GetWorkersParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.WorkerName)       queryParams.append('WorkerName', params.WorkerName);
    if (params.WorkerCategoryId) queryParams.append('WorkerCategoryId', params.WorkerCategoryId.toString());
    const response = await apiHelper.get(`workers?${queryParams.toString()}`);
    return response.data;
  };

  const getWorker = async (id: number) => {
    const response = await apiHelper.get(`workers/${id}`);
    return response.data;
  };

  const createWorker = async (worker: WorkerRequest) => {
    await apiHelper.post("workers", worker);
  };

  const updateWorker = async (id: number, worker: WorkerRequest) => {
    await apiHelper.put(`workers/${id}`, worker);
  };

  const deleteWorker = async (id: number) => {
    await apiHelper.delete(`workers/${id}`);
  };

  return { getWorkers, getWorker, createWorker, updateWorker, deleteWorker };
};

export { useWorkerService };