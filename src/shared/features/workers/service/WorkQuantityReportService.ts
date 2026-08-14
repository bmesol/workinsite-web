import { useAPIHelper } from '@/shared/helpers/ApiHelper';

export interface WorkQuantityReportItem {
  workType: {
    id: number;
    name: string;
    unit: { id: number; isActive: boolean; name: string; note: string | null };
    workerCategory: { id: number; name: string; note: string };
  };
  workMode: { id: number; name: string };
  estimatedQuantity: string;
  workedQuantity: string;
}

export interface WorkQuantityReportResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  items: WorkQuantityReportItem[];
}

export interface WorkQuantityReportParams {
  SiteId: number;
  WorkTypeId?: number;
  WorkModeId?: number;
}

const useWorkQuantityReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl);

  const getWorkQuantityReports = async (
    params: WorkQuantityReportParams,
  ): Promise<WorkQuantityReportResponse> => {
    const query = new URLSearchParams();
    query.append('SiteId', params.SiteId.toString());
    if (params.WorkTypeId) query.append('WorkTypeId', params.WorkTypeId.toString());
    if (params.WorkModeId) query.append('WorkModeId', params.WorkModeId.toString());

    const response = await apiHelper.get(`work-quantity-reports?${query.toString()}`);
    return response.data as WorkQuantityReportResponse;
  };

  return { getWorkQuantityReports };
};

export { useWorkQuantityReportService };