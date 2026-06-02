import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { MaterialRequest } from '../DTOs/MaterialProps';

export const useMaterialService = () => {
  const baseUrl = import.meta.env.VITE_MASTER_DATA_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getMaterials = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `materials?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getMaterial = async (id: number) => {
    const response = await apiHelper.get(`materials/${id}`);
    return response.data;
  };

  const createMaterial = async (material: MaterialRequest) => {
    const response = await apiHelper.post('materials', material);
    return response.data;
  };

  const updateMaterial = async (id: number, material: MaterialRequest) => {
    await apiHelper.put(`materials/${id}`, material);
  };

  const deleteMaterial = async (id: number) => {
    await apiHelper.delete(`materials/${id}`);
  };

  return {
    getMaterials,
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  };
};