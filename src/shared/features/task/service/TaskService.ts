import { useAPIHelper } from '@/shared/helpers/ApiHelper';

const useTaskService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getTasks = async () => {
    const { data } = await apiHelper.get('/tasks');
    return data;
  };

const createTask = async (payload: FormData) => {
  const { data } = await apiHelper.post('/tasks', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

const updateTask = async (id: number, payload: FormData) => {
  const { data } = await apiHelper.put(`/tasks/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

  const getTask = async (id: number) => {
    const { data } = await apiHelper.get(`/tasks/${id}`);
    return data;
  };

  const deleteTask = async (id: number) => {
    const { data } = await apiHelper.delete(`/tasks/${id}`);
    return data;
  };

  return { getTasks, getTask, deleteTask, createTask, updateTask }; 
};

export { useTaskService };