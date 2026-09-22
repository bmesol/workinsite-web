import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { workerRateAbstractRequest } from '../DTOs/WorkRateAbstract';

const useWorkRateAbstractService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkRateAbstracts = async (searchString: string = '') => {
    const { data } = await apiHelper.get(
      `work-rate-abstracts?searchString=${searchString}`,
    );
    return data;
  };

  const getWorkRateAbstract = async (id: number) => {
    const { data } = await apiHelper.get(`work-rate-abstracts/${id}`);
    return data;
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