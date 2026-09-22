import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
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
    const { data } = await apiHelper.get(`/curings?${buildQueryParams({
      SiteName: params.SiteName,
      Status: params.Status,
      CuringTypeId: params.CuringTypeId,
    })}`);
    return data;
  };

  const getCuring = async (id: number) => {
    const { data } = await apiHelper.get(`/curings/${id}`);
    return data;
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