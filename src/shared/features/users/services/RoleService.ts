import { userApiClient } from "@/shared/services/ApiClient";
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

// DTOs
export type RoleRequest = {
  name: string;
  // ... other role fields as per your RoleRequest DTO
};

type GetRolesParams = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
};

const createRoleService = () => {
  const getRoles = async (params: GetRolesParams = {}) => {
    const { data } = await userApiClient.get(`roles?${buildQueryParams({
      name: params.name,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
      ignorePagination: params.ignorePagination,
    })}`);
    return data;
  };

  const createRole = async (role: RoleRequest) => {
    const { data } = await userApiClient.post("roles", role);
    return data;
  };

  const getRole = async (id: number) => {
    const { data } = await userApiClient.get(`roles/${id}`);
    return data;
  };

  const updateRole = async (id: number, role: RoleRequest) => {
    await userApiClient.put(`roles/${id}`, role);
  };

  const deleteRole = async (id: number) => {
    await userApiClient.delete(`roles/${id}`);
  };

  return {
    getRoles,
    createRole,
    getRole,
    updateRole,
    deleteRole,
  };
};

export { createRoleService };