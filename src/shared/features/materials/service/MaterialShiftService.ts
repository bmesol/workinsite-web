import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type {
  MaterialShiftCreationRequest,
  MaterialShiftFilterRequest,
} from '../DTOs/MaterialShiftProps';

const useMaterialShiftService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getMaterialShifts = async (filters: MaterialShiftFilterRequest = {}) => {
    const { data } = await apiHelper.get(`/material-shifts?${buildQueryParams({
      materialId: filters.materialId,
      sourceSiteId: filters.sourceSiteId,
      targetSiteId: filters.targetSiteId,
      date: filters.date,
      quantity: filters.quantity,
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    })}`);
    return data;
  };

  const getMaterialShift = async (id: number) => {
    const { data } = await apiHelper.get(`material-shifts/${id}`);
    return data;
  };

  const createMaterialShift = async (data: MaterialShiftCreationRequest) => {
    await apiHelper.post('material-shifts', data);
  };

  const updateMaterialShift = async (id: number, data: MaterialShiftCreationRequest) => {
    await apiHelper.put(`material-shifts/${id}`, data);
  };

  const deleteMaterialShift = async (id: number) => {
    await apiHelper.delete(`material-shifts/${id}`);
  };

  const getMaximumAllowedQuantity = async (id: number): Promise<string> => {
    const { data } = await apiHelper.get(`material-shifts/${id}/maximum-quantity`);
    return data.maximumAllowedQuantity as string;
  };

  return {
    getMaterialShifts,
    getMaterialShift,
    createMaterialShift,
    updateMaterialShift,
    deleteMaterialShift,
    getMaximumAllowedQuantity,
  };
};

export { useMaterialShiftService };