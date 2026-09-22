import type { WorkerCategoryEditRequest } from "../DTOs/WorkerCategoryProps";
import { useAPIHelper } from "@/shared/helpers/ApiHelper";

const useWorkerCategoryService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerCategories = async (searchString: string = "", setIsLoading?: boolean) => {
    const { data } = await apiHelper.get(`worker-categories?searchString=${searchString}`, setIsLoading);
    return data;
  };

  const getWorkerCategory = async (id: number) => {
    const { data } = await apiHelper.get(`worker-categories/${id}`);
    return data;
  };

  const createWorkerCategory = async (workerCategory: any) => {
    const { data } = await apiHelper.post("worker-categories", workerCategory);
    return data;
  };
  const updateWorkerCategory = async (id: number, workerCategory: WorkerCategoryEditRequest) => {
    await apiHelper.put(`worker-categories/${id}`, workerCategory);
  };

  const deleteWorkerCategory = async (id: number) => {
    await apiHelper.delete(`worker-categories/${id}`);
  };

  return { getWorkerCategories, getWorkerCategory, createWorkerCategory, updateWorkerCategory, deleteWorkerCategory };
};

export { useWorkerCategoryService };