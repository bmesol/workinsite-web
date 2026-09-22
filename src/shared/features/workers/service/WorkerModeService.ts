import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { WorkModeRequest } from '../DTOs/WorkModeProps'; 

export const useWorkModeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || ''; 

  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkModes = async (searchString: string = '', setIsLoading?: boolean) => {
    const { data } = await apiHelper.get(
      `work-modes?searchString=${searchString}`,
      setIsLoading,
    );
    return data;
  };

  const getWorkMode = async (id: number) => {
    const { data } = await apiHelper.get(`work-modes/${id}`);
    return data;
  };

  const createWorkMode = async (workMode: WorkModeRequest) => {
    const { data } = await apiHelper.post('work-modes', workMode);
    return data;
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