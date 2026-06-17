import { useAPIHelper } from '@/shared/helpers/ApiHelper';
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
    const query = new URLSearchParams();
    if (params.clientId) query.append('ClientId', params.clientId.toString());
    if (params.fromDate) query.append('FromDate', params.fromDate);
    if (params.toDate) query.append('ToDate', params.toDate);
    if (params.pageNumber !== undefined)
      query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined)
      query.append('PageSize', params.pageSize.toString());
    if (params.ignorePagination !== undefined)
      query.append('IgnorePagination', String(params.ignorePagination));

    const response = await apiHelper.get(
      `client-transactions?${query.toString()}`,
    );
    return response.data;
  };

  const getClientTransaction = async (id: number) => {
    const response = await apiHelper.get(`client-transactions/${id}`);
    return response.data;
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