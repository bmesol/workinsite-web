import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { UnitRequest } from '../DTOs/UnitProps'; 
export const useUnitService = () => {
  const baseUrl = import.meta.env.VITE_MASTER_DATA_SERVICE_BASE_URL || ''; 
  const apiHelper = useAPIHelper(baseUrl, true);

  const getUnits = async (searchString: string = '', setIsLoading?: boolean) => {
    const { data } = await apiHelper.get(
      `units?searchString=${searchString}`,
      setIsLoading,
    );
    return data;
  };

  const getUnit = async (id: number) => {
    const { data } = await apiHelper.get(`units/${id}`);
    return data;
  };

  const createUnit = async (unit: UnitRequest) => {
    const { data } = await apiHelper.post('units', unit);
    return data;
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