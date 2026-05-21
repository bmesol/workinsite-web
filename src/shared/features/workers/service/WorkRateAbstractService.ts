import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { workerRateAbstractRequest } from '../DTOs/WorkRateAbstract';

const useWorkRateAbstractService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || ''; // ✅ react-native-config → import.meta.env
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkRateAbstracts = async (searchString: string = '') => {
    const response = await apiHelper.get(
      `work-rate-abstracts?searchString=${searchString}`,
    );
    return response.data;
  };

  const getWorkRateAbstract = async (id: number) => {
    const response = await apiHelper.get(`work-rate-abstracts/${id}`);
    return response.data;
  };

  const createWorkRateAbstract = async (site: workerRateAbstractRequest) => {
    await apiHelper.post('work-rate-abstracts', site);
  };

  const updateWorkRateAbstract = async (id: number, site: workerRateAbstractRequest) => {
    await apiHelper.put(`work-rate-abstracts/${id}`, site);
  };

  const deleteWorkRateAbstract = async (id: number) => {
    await apiHelper.delete(`work-rate-abstracts/${id}`);
  };

  return {
    getWorkRateAbstracts,
    getWorkRateAbstract,
    createWorkRateAbstract,
    updateWorkRateAbstract,
    deleteWorkRateAbstract,
  };
};

export { useWorkRateAbstractService };