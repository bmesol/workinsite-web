import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { InventoryStockReportParams } from '../DTOs/InventoryStockReportParams';
import type { InventoryStockReportResponse } from '../DTOs/InventoryStockReportProps';

const useInventoryStockReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getInventoryStockReport = async (
    params: InventoryStockReportParams,
  ): Promise<InventoryStockReportResponse> => {
    const { data } = await apiHelper.get(`material-reports?${buildQueryParams({
      SiteId: params.SiteId,
      FromDate: params.FromDate,
      ToDate: params.ToDate,
      PageNumber: params.PageNumber,
      PageSize: params.PageSize,
    })}`);
    return data;
  };

  return { getInventoryStockReport };
};

export { useInventoryStockReportService };
