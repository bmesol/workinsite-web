import type {
  MaterialUsedCreationRequest,
  MaterialUsedUpdationRequest,
} from '../DTOs/MaterialUsedProps';
import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

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
    const { data } = await apiHelper.get(`material-usages?${buildQueryParams({
      Date: params.date,
      SiteId: params.siteId,
      MaterialId: params.materialId,
      Quantity: params.quantity,
      WorkModeId: params.workModeId,
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    })}`);
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
    const { data } = await apiHelper.get(
      `purchases/available-material-report?${buildQueryParams({
        SiteId: params.siteId,
        Date: params.date,
        MaterialIds: params.materialIds,
      })}`,
    );
    return data as AvailableMaterialReport[];
  };

  const getMaximumAllowedQuantity = async (id: number): Promise<string> => {
    const { data } = await apiHelper.get(`material-usages/${id}/maximum-quantity`);
    return data.maximumAllowedQuantity as string;
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