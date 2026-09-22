import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { WorkerTransactionRequest } from '../DTOs/WorkerTransaction';

interface WorkerTransactionParams {
  workerId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
}

const useWorkerTransactionService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWorkerTransactions = async (params: WorkerTransactionParams) => {
    const { data } = await apiHelper.get(
      `worker-transactions?${buildQueryParams({
        WorkerId: params.workerId,
        FromDate: params.fromDate,
        ToDate: params.toDate,
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
        IgnorePagination: params.ignorePagination,
      })}`,
    );
    return data;
  };

  const getWorkerTransaction = async (id: number) => {
    const { data } = await apiHelper.get(`worker-transactions/${id}`);
    return data;
  };

  const createWorkerTransaction = async (
    transaction: WorkerTransactionRequest,
  ) => {
    await apiHelper.post('worker-transactions', transaction);
  };

  const updateWorkerTransaction = async (
    id: number,
    transaction: WorkerTransactionRequest,
  ) => {
    await apiHelper.put(`worker-transactions/${id}`, transaction);
  };

  const deleteWorkerTransaction = async (id: number) => {
    await apiHelper.delete(`worker-transactions/${id}`);
  };

  return {
    getWorkerTransactions,
    getWorkerTransaction,
    createWorkerTransaction,
    updateWorkerTransaction,
    deleteWorkerTransaction,
  };
};

export { useWorkerTransactionService };