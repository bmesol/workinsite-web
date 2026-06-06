import type {
  MaterialUsedCreationRequest,
  MaterialUsedUpdationRequest,
} from '../DTOs/MaterialUsedProps';
import { useAPIHelper } from '@/shared/helpers/ApiHelper';

type GetMaterialsUsedParams = {
  date?: string;
  siteId?: number;
  materialId?: number;
  quantity?: string;
  workModeId?: number;
  pageNumber?: number;
  pageSize?: number;
};

export type AvailableMaterial = {
  material: {
    id: number;
    name: string;
    hsnCode: string | null;
    unit: {
      id: number;
      isActive: boolean;
      name: string;
      note: string | null;
    };
  };
  availableQuantity: string;
};

export type AvailableMaterialReport = {
  material: {
    id: number;
    name: string;
    hsnCode: string | null;
    unit: {
      id: number;
      isActive: boolean;
      name: string;
      note: string | null;
    };
  };
  availableQuantity: string;
};

export type GetAvailableMaterialReportParams = {
  siteId: number;
  date: string;
  materialIds?: number[];
};

export const useMaterialUsedService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getMaterialsUsed = async (params: GetMaterialsUsedParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.date)       queryParams.append('Date', params.date);
    if (params.siteId)     queryParams.append('SiteId', params.siteId.toString());
    if (params.materialId) queryParams.append('MaterialId', params.materialId.toString());
    if (params.quantity)   queryParams.append('Quantity', params.quantity);
    if (params.workModeId) queryParams.append('WorkModeId', params.workModeId.toString());
    if (params.pageNumber) queryParams.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize)   queryParams.append('PageSize', params.pageSize.toString());

    const { data } = await apiHelper.get(`material-usages?${queryParams.toString()}`);
    return data;
  };

  const getMaterialUsedById = async (id: number) => {
    const { data } = await apiHelper.get(`material-usages/${id}`);
    return data;
  };

  const createMaterialUsed = async (payload: MaterialUsedCreationRequest) => {
    const { data } = await apiHelper.post('material-usages', payload);
    return data;
  };

  const updateMaterialUsed = async (
    id: number,
    payload: MaterialUsedUpdationRequest,
  ) => {
    const { data } = await apiHelper.put(`material-usages/${id}`, payload);
    return data;
  };

  const deleteMaterialUsed = async (id: number) => {
    const { data } = await apiHelper.delete(`material-usages/${id}`);
    return data;
  };

  const getAvailableMaterialsBySite = async (
    siteId: number,
  ): Promise<AvailableMaterial[]> => {
    const { data } = await apiHelper.get(
      `purchases/materials/available-quantity?siteId=${siteId}`,
    );
    return data as AvailableMaterial[];
  };

  const getAvailableMaterialReport = async (
    params: GetAvailableMaterialReportParams,
  ): Promise<AvailableMaterialReport[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append('SiteId', params.siteId.toString());
    queryParams.append('Date', params.date);

    if (params.materialIds && params.materialIds.length > 0) {
      params.materialIds.forEach(id =>
        queryParams.append('MaterialIds', id.toString()),
      );
    }

    const { data } = await apiHelper.get(
      `purchases/available-material-report?${queryParams.toString()}`,
    );
    return data as AvailableMaterialReport[];
  };

  const getMaximumAllowedQuantity = async (id: number): Promise<string> => {
    const response = await apiHelper.get(`material-usages/${id}/maximum-quantity`);
    return response.data.maximumAllowedQuantity as string;
  };

  return {
    getMaterialsUsed,
    getMaterialUsedById,
    createMaterialUsed,
    updateMaterialUsed,
    deleteMaterialUsed,
    getAvailableMaterialsBySite,
    getAvailableMaterialReport,
    getMaximumAllowedQuantity,
  };
};