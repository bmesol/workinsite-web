import { userApiClient } from "@/shared/services/ApiClient";

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

const useRoleService = () => {
  const getRoles = async (params: GetRolesParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append("name", params.name);
    if (params.pageNumber) queryParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params.ignorePagination) queryParams.append("ignorePagination", String(params.ignorePagination));

    const response = await userApiClient.get(`roles?${queryParams.toString()}`);
    return response.data;
  };

  const createRole = async (role: RoleRequest) => {
    const response = await userApiClient.post("roles", role);
    return response.data;
  };

  const getRole = async (id: number) => {
    const response = await userApiClient.get(`roles/${id}`);
    return response.data;
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

export { useRoleService };