import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type {
  CuringCreationRequest,
  CuringUpdationRequest,
} from '../DTOs/CuringProps';

type GetCuringParams = {
  SiteName?: string;
  Status?: number;
  CuringTypeId?: number;
};

const useCuringService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getCurings = async (params: GetCuringParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.SiteName) queryParams.append('SiteName', params.SiteName);
    if (params.Status) queryParams.append('Status', params.Status.toString());
    if (params.CuringTypeId) queryParams.append('CuringTypeId', params.CuringTypeId.toString());

    const { data } = await apiHelper.get(`/curings?${queryParams.toString()}`);
    return data;
  };

  const getCuring = async (id: number) => {
    const response = await apiHelper.get(`/curings/${id}`);
    return response.data;
  };

  const createCuring = async (curing: CuringCreationRequest) => {
    await apiHelper.post('/curings', curing);
  };

  const updateCuring = async (id: number, curing: CuringUpdationRequest) => {
    await apiHelper.put(`/curings/${id}`, curing);
  };

  const deleteCuring = async (id: number) => {
    await apiHelper.delete(`/curings/${id}`);
  };

  return {
    getCurings,
    getCuring,
    createCuring,
    updateCuring,
    deleteCuring,
  };
};

export { useCuringService };