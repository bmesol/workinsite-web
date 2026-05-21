import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WorkerRole, WorkerRoles } from "../DTOs/WorkRoleProps";

interface GetWorkerRolesParams {
  WorkerRoleName?: string;
  WorkerCategoryId?: number;
  ResultLimit?: number;
}

export const useWorkerRoleService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";  // ← react-native-config → vite env
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerRoles = async ({
    WorkerRoleName = "",
    WorkerCategoryId,
    ResultLimit,
  }: GetWorkerRolesParams) => {
    const params = new URLSearchParams();
    if (WorkerRoleName) params.append("WorkerRoleName", WorkerRoleName);
    if (WorkerCategoryId !== undefined)
      params.append("WorkerCategoryId", WorkerCategoryId.toString());
    if (ResultLimit !== undefined)
      params.append("ResultLimit", ResultLimit.toString());

    const response = await apiHelper.get(`worker-roles?${params.toString()}`);
    return response.data;
  };

  const getWorkerRole = async (id: number) => {
    const response = await apiHelper.get(`worker-roles/${id}`);
    return response.data;
  };

  const createWorkerRole = async (workerRoles: WorkerRole) => {
    const response = await apiHelper.post("worker-roles", workerRoles);
    return response.data;
  };

  const updateWorkerRole = async (id: number, workerRoles: WorkerRoles) => {
    const response = await apiHelper.put(`worker-roles/${id}`, workerRoles);
    return response;
  };

  const deleteWorkerRole = async (id: number) => {
    await apiHelper.delete(`worker-roles/${id}`);
  };

  const getWorkerRoleUsage = async (id: number) => {
    const response = await apiHelper.get(`worker-roles/${id}/usage`);
    return response.data;
  };

  return {
    getWorkerRoles,
    getWorkerRole,
    createWorkerRole,
    updateWorkerRole,
    deleteWorkerRole,
    getWorkerRoleUsage,
  };
};