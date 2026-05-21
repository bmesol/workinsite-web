import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { ShiftRequest } from '../DTOs/ShiftProps';

export const useShiftService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getShifts = async (
    searchString: string = '',
    setIsLoading?: boolean,
  ) => {
    const response = await apiHelper.get(
      `shifts?searchString=${searchString}`,
      setIsLoading,
    );
    return response.data;
  };

  const getShift = async (id: number) => {
    const response = await apiHelper.get(`shifts/${id}`);
    return response.data;
  };

  const createShift = async (shifts: ShiftRequest) => {
    const response = await apiHelper.post('shifts', shifts);
    return response.data;
  };

  const updateShift = async (id: number, shifts: ShiftRequest) => {
    const response = await apiHelper.put(`shifts/${id}`, shifts);
    return response;
  };

  const deleteShift = async (id: number) => {
    await apiHelper.delete(`shifts/${id}`);
  };

  return { getShifts, getShift, createShift, updateShift, deleteShift };
};