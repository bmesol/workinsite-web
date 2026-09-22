import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type {
  AttendanceReportParams,
  WorkerReportSummaryResponse,
} from '../DTOs/WorkerreportProps';
import type { WorkerReportResponse } from '../DTOs/Workerreportdetails';

const useWorkerReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getAttendanceReportSummary = async (
    params: AttendanceReportParams,
  ): Promise<WorkerReportSummaryResponse> => {
    const { data } = await apiHelper.get(`attendance-reports/summary?${buildQueryParams({
      SiteId: params.SiteId,
      WorkerId: params.WorkerId,
      FromDate: params.FromDate,
      ToDate: params.ToDate,
      PageNumber: params.PageNumber,
      PageSize: params.PageSize,
      IgnorePagination: params.IgnorePagination,
    })}`);
    return data;
  };

  const getAttendanceReports = async (
    params: AttendanceReportParams,
  ): Promise<WorkerReportResponse> => {
    const { data } = await apiHelper.get(`attendance-reports?${buildQueryParams({
      SiteId: params.SiteId,
      WorkerId: params.WorkerId,
      FromDate: params.FromDate,
      ToDate: params.ToDate,
      PageNumber: params.PageNumber,
      PageSize: params.PageSize,
      IgnorePagination: params.IgnorePagination,
    })}`);
    return data;
  };

  return { getAttendanceReportSummary, getAttendanceReports };
};

export { useWorkerReportService };