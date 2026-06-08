import { useAPIHelper } from '@/shared/helpers/ApiHelper';
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
    const query = new URLSearchParams();
    if (params?.SupervisorId !== undefined)
      query.append('SupervisorId', String(params.SupervisorId));
    if (params?.FromDate)
      query.append('FromDate', params.FromDate);
    if (params?.ToDate)
      query.append('ToDate', params.ToDate);
    if (params?.PageNumber !== undefined)
      query.append('PageNumber', String(params.PageNumber));
    if (params?.PageSize !== undefined)
      query.append('PageSize', String(params.PageSize));
    if (params?.IgnorePagination !== undefined)
      query.append('IgnorePagination', String(params.IgnorePagination));

    const { data } = await apiHelper.get(
      `/supervisor-attendances?${query.toString()}`,
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