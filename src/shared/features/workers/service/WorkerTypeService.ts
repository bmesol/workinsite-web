import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WorkType } from "../DTOs/WorkTypeProps";

export const useWorkTypeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";  // ← react-native-config → vite env
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkTypes = async (searchString: string = "") => {
    const response = await apiHelper.get(`work-types?searchString=${searchString}`);
    return response.data;
  };

  const getWorkType = async (id: number) => {
    const response = await apiHelper.get(`work-types/${id}`);
    return response.data;
  };

  const createWorkType = async (workerRoles: string) => {
    const response = await apiHelper.post("work-types", workerRoles);
    return response.data;
  };

  const updateWorkType = async (id: number, workerRoles: WorkType) => {
    const response = await apiHelper.put(`work-types/${id}`, workerRoles);
    return response;
  };

  const deleteWorkType = async (id: number) => {
    await apiHelper.delete(`work-types/${id}`);
  };

  const getWorkTypeUsage = async (id: number) => {
    const response = await apiHelper.get(`work-types/${id}/usage`);
    return response.data;
  };

  return {
    getWorkTypes,
    getWorkType,
    createWorkType,
    updateWorkType,
    deleteWorkType,
    getWorkTypeUsage,
  };
};