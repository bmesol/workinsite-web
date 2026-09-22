import { useAPIHelper } from '@/shared/helpers/ApiHelper';
import { buildQueryParams } from '@/shared/utils/buildQueryParams';
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
    const { data } = await apiHelper.get(
      `supplier-transactions?${buildQueryParams({
        SupplierId: params.supplierId,
        FromDate: params.fromDate,
        ToDate: params.toDate,
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
        IgnorePagination: params.ignorePagination,
      })}`,
    );
    return data;
  };

  const getSupplierTransaction = async (id: number) => {
    const { data } = await apiHelper.get(`supplier-transactions/${id}`);
    return data;
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