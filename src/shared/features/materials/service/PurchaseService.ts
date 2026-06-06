import { useAPIHelper } from '@/shared/helpers/ApiHelper';
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
    const queryParams = new URLSearchParams();
    if (filters.billNumber) queryParams.append('BillNumber', filters.billNumber);
    if (filters.siteId) queryParams.append('SiteId', filters.siteId.toString());
    if (filters.supplierId) queryParams.append('SupplierId', filters.supplierId.toString());
    if (filters.date) queryParams.append('Date', filters.date);
    if (filters.pageNumber) queryParams.append('PageNumber', filters.pageNumber.toString());
    if (filters.pageSize) queryParams.append('PageSize', filters.pageSize.toString());

    const { data } = await apiHelper.get(`/purchases?${queryParams.toString()}`);
    return data;
  };

  const getMaterialPurchase = async (id: number) => {
    const response = await apiHelper.get(`purchases/${id}`);
    return response.data;
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

  const deleteMaterialPurchase = async (id: number) => {
    await apiHelper.delete(`purchases/${id}`);
  };

  return {
    getMaterialPurchases,
    getMaterialPurchase,
    createMaterialPurchase,
    updateMaterialPurchase,
    deleteMaterialPurchase,
  };
};

export { useMaterialPurchaseService };