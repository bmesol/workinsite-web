import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { WorkModeRequest } from '../DTOs/WorkModeProps'; 

export const useWorkModeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || ''; 

  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkModes = async (searchString: string = '', setIsLoading?: boolean) => {
    const response = await apiHelper.get(
      `work-modes?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getWorkMode = async (id: number) => {
    const response = await apiHelper.get(`work-modes/${id}`);
    return response.data;
  };

  const createWorkMode = async (workMode: WorkModeRequest) => {
    const response = await apiHelper.post('work-modes', workMode);
    return response.data;
  };

  const updateWorkMode = async (id: number, workMode: WorkModeRequest) => {
    const response = await apiHelper.put(`work-modes/${id}`, workMode);
    return response;
  };

  const deleteWorkMode = async (id: number) => {
    await apiHelper.delete(`work-modes/${id}`);
  };

  return { getWorkModes, getWorkMode, createWorkMode, updateWorkMode, deleteWorkMode };
};