import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { SiteExpenseReportParams, SiteExpenseReportResponse } from '../DTOs/SiteExpenseReportProps';

const useSiteExpenseReportService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getSiteExpenseReport = async (
    params: SiteExpenseReportParams,
  ): Promise<SiteExpenseReportResponse> => {
    const { data } = await apiHelper.get(`expense-reports?${buildQueryParams({
      SiteId: params.SiteId,
      FromDate: params.FromDate,
      ToDate: params.ToDate,
    })}`);
    return data;
  };

  return { getSiteExpenseReport };
};

export { useSiteExpenseReportService };
