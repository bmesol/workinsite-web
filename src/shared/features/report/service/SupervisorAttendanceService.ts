import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type {
  SupervisorAttendanceCreationRequest,
  SupervisorAttendanceListParams,
  SupervisorAttendanceListResponse,
  SupervisorAttendance,
} from '../DTOs/SupervisorAttendanceProps';

const useSupervisorAttendanceService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getSupervisorAttendances = async (
    params?: SupervisorAttendanceListParams,
  ): Promise<SupervisorAttendanceListResponse> => {
    const { data } = await apiHelper.get(
      `/supervisor-attendances?${buildQueryParams({
        SupervisorId: params?.SupervisorId,
        FromDate: params?.FromDate,
        ToDate: params?.ToDate,
        PageNumber: params?.PageNumber,
        PageSize: params?.PageSize,
        IgnorePagination: params?.IgnorePagination,
      })}`,
    );
    return data;
  };

  const getSupervisorAttendance = async (
    id: number,
  ): Promise<SupervisorAttendance> => {
    const { data } = await apiHelper.get(`/supervisor-attendances/${id}`);
    return data;
  };

  const createSupervisorAttendance = async (
    payload: SupervisorAttendanceCreationRequest,
  ): Promise<void> => {
    await apiHelper.post('/supervisor-attendances', payload);
  };

  const deleteSupervisorAttendance = async (id: number): Promise<void> => {
    await apiHelper.delete(`/supervisor-attendances/${id}`);
  };

  return {
    getSupervisorAttendances,
    getSupervisorAttendance,
    createSupervisorAttendance,
    deleteSupervisorAttendance,
  };
};

export { useSupervisorAttendanceService };