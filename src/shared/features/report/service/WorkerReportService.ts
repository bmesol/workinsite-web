import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type {
  AttendanceReportParams,
  WorkerReportSummaryResponse,
} from '../DTOs/WorkerreportProps';
import type { WorkerReportResponse } from '../DTOs/Workerreportdetails';

const useWorkerReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const buildQuery = (params: AttendanceReportParams): string => {
    const q = new URLSearchParams();
    if (params.SiteId)                    q.append('SiteId',            params.SiteId.toString());
    if (params.WorkerId)                  q.append('WorkerId',          params.WorkerId.toString());
    if (params.FromDate)                  q.append('FromDate',          params.FromDate);
    if (params.ToDate)                    q.append('ToDate',            params.ToDate);
    if (params.PageNumber)                q.append('PageNumber',        params.PageNumber.toString());
    if (params.PageSize)                  q.append('PageSize',          params.PageSize.toString());
    if (params.IgnorePagination !== undefined)
      q.append('IgnorePagination', params.IgnorePagination.toString());
    return q.toString();
  };

  const getAttendanceReportSummary = async (
    params: AttendanceReportParams,
  ): Promise<WorkerReportSummaryResponse> => {
    const res = await apiHelper.get(`attendance-reports/summary?${buildQuery(params)}`);
    return res.data;
  };

  const getAttendanceReports = async (
    params: AttendanceReportParams,
  ): Promise<WorkerReportResponse> => {
    const res = await apiHelper.get(`attendance-reports?${buildQuery(params)}`);
    return res.data;
  };

  return { getAttendanceReportSummary, getAttendanceReports };
};

export { useWorkerReportService };