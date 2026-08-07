import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { InventoryStockReportParams } from '../DTOs/InventoryStockReportParams';
import type { InventoryStockReportResponse } from '../DTOs/InventoryStockReportProps';

const useInventoryStockReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getInventoryStockReport = async (
    params: InventoryStockReportParams,
  ): Promise<InventoryStockReportResponse> => {
    const q = new URLSearchParams();
    if (params.SiteId) q.append('SiteId', params.SiteId.toString());
    q.append('FromDate', params.FromDate);
    q.append('ToDate', params.ToDate);
    q.append('PageNumber', params.PageNumber.toString());
    q.append('PageSize', params.PageSize.toString());

    const res = await apiHelper.get(`material-reports?${q.toString()}`);
    return res.data;
  };

  return { getInventoryStockReport };
};

export { useInventoryStockReportService };
