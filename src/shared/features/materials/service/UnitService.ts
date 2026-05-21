import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { UnitRequest } from '../DTOs/UnitProps'; 
export const useUnitService = () => {
  const baseUrl = import.meta.env.VITE_MASTER_DATA_SERVICE_BASE_URL || ''; 
  const apiHelper = useAPIHelper(baseUrl, true);

  const getUnits = async (searchString: string = '', setIsLoading?: boolean) => {
    const response = await apiHelper.get(
      `units?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getUnit = async (id: number) => {
    const response = await apiHelper.get(`units/${id}`);
    return response.data;
  };

  const createUnit = async (unit: UnitRequest) => {
    const response = await apiHelper.post('units', unit);
    return response.data;
  };

  const updateUnit = async (id: number, unit: UnitRequest) => {
    const response = await apiHelper.put(`units/${id}`, unit);
    return response;
  };

  const deleteUnit = async (id: number) => {
    await apiHelper.delete(`units/${id}`);
  };

  return { getUnits, getUnit, createUnit, updateUnit, deleteUnit };
};