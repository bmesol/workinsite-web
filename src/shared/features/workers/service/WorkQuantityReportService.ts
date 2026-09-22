import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

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
    const { data } = await apiHelper.get(`work-quantity-reports?${buildQueryParams({
      SiteId: params.SiteId,
      WorkTypeId: params.WorkTypeId,
      WorkModeId: params.WorkModeId,
    })}`);
    return data as WorkQuantityReportResponse;
  };

  return { getWorkQuantityReports };
};

export { useWorkQuantityReportService };