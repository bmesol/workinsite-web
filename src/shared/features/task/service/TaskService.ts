import { useAPIHelper } from '@/shared/helpers/ApiHelper';

const useTaskService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getTasks = async () => {
    const { data } = await apiHelper.get('/tasks');
    return data;
  };

  const getTask = async (id: number) => {
    const { data } = await apiHelper.get(`/tasks/${id}`);
    return data;
  };

  return { getTasks, getTask };
};

export { useTaskService };