import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import type { SupplierTransactionRequest } from '../DTOs/SupplierTransaction';

interface SupplierTransactionParams {
  supplierId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  ignorePagination?: boolean;
}

const useSupplierTransactionService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || '';
  const apiHelper = useAPIHelper(baseUrl, true);

  const getSupplierTransactions = async (params: SupplierTransactionParams) => {
    const query = new URLSearchParams();
    if (params.supplierId) query.append('SupplierId', params.supplierId.toString());
    if (params.fromDate) query.append('FromDate', params.fromDate);
    if (params.toDate) query.append('ToDate', params.toDate);
    if (params.pageNumber !== undefined) query.append('PageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined) query.append('PageSize', params.pageSize.toString());
    if (params.ignorePagination !== undefined) query.append('IgnorePagination', String(params.ignorePagination));

    const response = await apiHelper.get(`supplier-transactions?${query.toString()}`);
    return response.data;
  };

  const getSupplierTransaction = async (id: number) => {
    const response = await apiHelper.get(`supplier-transactions/${id}`);
    return response.data;
  };

  const createSupplierTransaction = async (transaction: SupplierTransactionRequest) => {
    await apiHelper.post('supplier-transactions', transaction);
  };

  const updateSupplierTransaction = async (id: number, transaction: SupplierTransactionRequest) => {
    await apiHelper.put(`supplier-transactions/${id}`, transaction);
  };

  const deleteSupplierTransaction = async (id: number) => {
    await apiHelper.delete(`supplier-transactions/${id}`);
  };

  return {
    getSupplierTransactions,
    getSupplierTransaction,
    createSupplierTransaction,
    updateSupplierTransaction,
    deleteSupplierTransaction,
  };
};

export { useSupplierTransactionService };