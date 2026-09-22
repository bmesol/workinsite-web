import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { WorkerRole, WorkerRoles } from "../DTOs/WorkRoleProps";
import type { GetWorkerRoleCostParams, WorkerRoleCost } from "../pages/workerrole-cost-edit/DTOs";

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
    const { data } = await apiHelper.get(
      `worker-roles?${buildQueryParams({ WorkerRoleName, WorkerCategoryId, ResultLimit })}`,
    );
    return data;
  };

  const getWorkerRole = async (id: number) => {
    const { data } = await apiHelper.get(`worker-roles/${id}`);
    return data;
  };

  const createWorkerRole = async (workerRoles: WorkerRole) => {
    const { data } = await apiHelper.post("worker-roles", workerRoles);
    return data;
  };

  const updateWorkerRole = async (id: number, workerRoles: WorkerRoles) => {
    const response = await apiHelper.put(`worker-roles/${id}`, workerRoles);
    return response;
  };

  const deleteWorkerRole = async (id: number) => {
    await apiHelper.delete(`worker-roles/${id}`);
  };

  const getWorkerRoleUsage = async (id: number) => {
    const { data } = await apiHelper.get(`worker-roles/${id}/usage`);
    return data;
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

export const useWorkerRoleCostService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerRoleCosts = async (params: GetWorkerRoleCostParams) => {
    const { data } = await apiHelper.get(
      `worker-role-costs?${buildQueryParams({
        WorkerCategoryId: params.WorkerCategoryId,
        WorkerId: params.WorkerId,
      })}`,
    );
    return data;
  };

  const createWorkerRoleCost = async (cost: WorkerRoleCost) => {
    const { data } = await apiHelper.post("worker-role-costs", cost);
    return data;
  };

  return { getWorkerRoleCosts, createWorkerRoleCost };
};