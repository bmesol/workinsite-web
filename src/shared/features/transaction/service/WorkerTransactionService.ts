import { useAPIHelper } from '@/shared/helpers/ApiHelper';
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
    const query = new URLSearchParams();
    if (params.workerId) query.append('WorkerId', params.workerId.toString());
    if (params.fromDate) query.append('FromDate', params.fromDate);
    if (params.toDate) query.append('ToDate', params.toDate);
    if (params.pageNumber !== undefined)
      query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined)
      query.append('PageSize', params.pageSize.toString());
    if (params.ignorePagination !== undefined)
      query.append('IgnorePagination', String(params.ignorePagination));

    const response = await apiHelper.get(
      `worker-transactions?${query.toString()}`,
    );
    return response.data;
  };

  const getWorkerTransaction = async (id: number) => {
    const response = await apiHelper.get(`worker-transactions/${id}`);
    return response.data;
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