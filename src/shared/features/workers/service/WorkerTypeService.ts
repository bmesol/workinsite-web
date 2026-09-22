import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WorkType } from "../DTOs/WorkTypeProps";

export const useWorkTypeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";  // ← react-native-config → vite env
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkTypes = async (searchString: string = "") => {
    const { data } = await apiHelper.get(`work-types?searchString=${searchString}`);
    return data;
  };

  const getWorkType = async (id: number) => {
    const { data } = await apiHelper.get(`work-types/${id}`);
    return data;
  };

  const createWorkType = async (workerRoles: string) => {
    const { data } = await apiHelper.post("work-types", workerRoles);
    return data;
  };

  const updateWorkType = async (id: number, workerRoles: WorkType) => {
    const response = await apiHelper.put(`work-types/${id}`, workerRoles);
    return response;
  };

  const deleteWorkType = async (id: number) => {
    await apiHelper.delete(`work-types/${id}`);
  };

  const getWorkTypeUsage = async (id: number) => {
    const { data } = await apiHelper.get(`work-types/${id}/usage`);
    return data;
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