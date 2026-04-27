import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WorkerRequest } from "../DTOs/WorkerProps";

const useWorkerService = () => {
  const baseUrl = import.meta.env.VITE_SUPPLIER_SERVICE_BASE_URL || "";  
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkers = async (searchString: string = "") => {
    const response = await apiHelper.get(`workers?searchString=${searchString}`);
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
