import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
import type { ClientTransactionRequest } from '../DTOs/ClientTransaction';

interface ClientTransactionParams {
  clientId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
}

const useClientTransactionService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getClientTransactions = async (params: ClientTransactionParams) => {
    const { data } = await apiHelper.get(
      `client-transactions?${buildQueryParams({
        ClientId: params.clientId,
        FromDate: params.fromDate,
        ToDate: params.toDate,
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
        IgnorePagination: params.ignorePagination,
      })}`,
    );
    return data;
  };

  const getClientTransaction = async (id: number) => {
    const { data } = await apiHelper.get(`client-transactions/${id}`);
    return data;
  };

  const createClientTransaction = async (
    transaction: ClientTransactionRequest,
  ) => {
    await apiHelper.post('client-transactions', transaction);
  };

  const updateClientTransaction = async (
    id: number,
    transaction: ClientTransactionRequest,
  ) => {
    await apiHelper.put(`client-transactions/${id}`, transaction);
  };

  const deleteClientTransaction = async (id: number) => {
    await apiHelper.delete(`client-transactions/${id}`);
  };

  return {
    getClientTransactions,
    getClientTransaction,
    createClientTransaction,
    updateClientTransaction,
    deleteClientTransaction,
  };
};

export { useClientTransactionService };