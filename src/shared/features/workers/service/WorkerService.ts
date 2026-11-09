// WorkerService.ts
import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { Worker, WorkerRequest } from "../DTOs/WorkerProps";

type GetWorkersParams = {
  WorkerName?: string;
  WorkerCategoryId?: number;
};

const useWorkerService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

const getWorkers = async (params: GetWorkersParams = {}): Promise<Worker[]> => {
  const { data } = await apiHelper.get<{ items: Worker[] }>(`workers?${buildQueryParams({
    WorkerName: params.WorkerName,
    WorkerCategoryId: params.WorkerCategoryId,
  })}`);
  return data.items;
};
  const getWorker = async (id: number) => {
    const { data } = await apiHelper.get<Worker>(`workers/${id}`);
    return data;
  };

  const createWorker = async (worker: WorkerRequest) => {
  const { data } = await apiHelper.post("workers", worker);
  return data;
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