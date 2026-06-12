import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { CuringTypeCreationRequest, CuringTypeUpdationRequest } from '../DTOs/CuringTypeProps';

const useCuringTypeService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getCuringTypes = async () => {
    const { data } = await apiHelper.get('/curings-types');
    return data;
  };

  const getCuringType = async (id: number) => {
    const response = await apiHelper.get(`/curings-types/${id}`);
    return response.data;
  };

  const createCuringType = async (curingType: CuringTypeCreationRequest) => {
    await apiHelper.post('/curings-types', curingType);
  };

  const updateCuringType = async (id: number, curingType: CuringTypeUpdationRequest) => {
    await apiHelper.put(`/curings-types/${id}`, curingType);
  };

  const deleteCuringType = async (id: number) => {
    await apiHelper.delete(`/curings-types/${id}`);
  };

  return {
    getCuringTypes,
    getCuringType,
    createCuringType,
    updateCuringType,
    deleteCuringType,
  };
};

export { useCuringTypeService };