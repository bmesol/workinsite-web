import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

type GetAttendanceParams = {
  siteId?: number;
  wageTypeId?: number;
  workTypeId?: number;
  workerId?: number;
  date?: string;
  pageNumber?: number;
  pageSize?: number;
};

const useAttendanceService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getAttendances = async (params: GetAttendanceParams = {}) => {
    const { data } = await apiHelper.get(`/attendances?${buildQueryParams({
      SiteId: params.siteId,
      WageTypeId: params.wageTypeId,
      WorkTypeId: params.workTypeId,
      WorkerId: params.workerId,
      Date: params.date,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    })}`);
    return data;
  };

  const getAttendance = async (id: number) => {
    const { data } = await apiHelper.get(`attendances/${id}`);
    return data;
  };

  const createAttendance = async (attendance: FormData) => {
    await apiHelper.post('attendances', attendance, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const updateAttendance = async (id: number, attendance: FormData) => {
    await apiHelper.put(`attendances/${id}`, attendance, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  const deleteAttendance = async (id: number) => {
    await apiHelper.delete(`attendances/${id}`);
  };

  return {
    getAttendances,
    getAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance,
  };
};

export { useAttendanceService };