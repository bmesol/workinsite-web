import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { AxiosRequestHeaders } from 'axios';

type MaterialPurchasesfilters = {
  billNumber?: string;
  siteId?: number;
  supplierId?: number;
  date?: string;
  pageNumber?: number;
  pageSize?: number;
};

const useMaterialPurchaseService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getMaterialPurchases = async (filters: MaterialPurchasesfilters = {}) => {
    const { data } = await apiHelper.get(`/purchases?${buildQueryParams({
      BillNumber: filters.billNumber,
      SiteId: filters.siteId,
      SupplierId: filters.supplierId,
      Date: filters.date,
      PageNumber: filters.pageNumber,
      PageSize: filters.pageSize,
    })}`);
    return data;
  };

  const getMaterialPurchase = async (id: number) => {
    const { data } = await apiHelper.get(`purchases/${id}`);
    return data;
  };

  const createMaterialPurchase = async (purchase: FormData) => {
    await apiHelper.post('purchases', purchase, {
      headers: { 'Content-Type': 'multipart/form-data' } as AxiosRequestHeaders,
    });
  };

  const updateMaterialPurchase = async (id: number, purchase: FormData) => {
    await apiHelper.put(`purchases/${id}`, purchase, {
      headers: { 'Content-Type': 'multipart/form-data' } as AxiosRequestHeaders,
    });
  };

  const getMinimumQuantity = async (
  purchaseMaterialId: number
): Promise<{ minimumAllowedQuantity: string }> => {
  const { data } = await apiHelper.get(
    `purchases/purchase-materials/${purchaseMaterialId}/minimum-quantity`,
  );
  return data;
};

  const deleteMaterialPurchase = async (id: number) => {
    await apiHelper.delete(`purchases/${id}`);
  };

  return {
    getMaterialPurchases,
    getMaterialPurchase,
    createMaterialPurchase,
    updateMaterialPurchase,
    deleteMaterialPurchase,
    getMinimumQuantity,
  };
};

export { useMaterialPurchaseService };