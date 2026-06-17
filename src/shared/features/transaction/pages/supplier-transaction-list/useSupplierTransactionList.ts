import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useSupplierTransactionService } from '../../service/SupplierTransactionService';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import type { SupplierTransactionProps } from '../../DTOs/SupplierTransaction';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import { SupplierTransactionUrls } from '../../utils/urls';

const useSupplierTransactiontList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const supplierTransactionService = useSupplierTransactionService();
  const supplierService = useSupplierService();

  const [transactions, setTransactions] = useState<SupplierTransactionProps[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [supplier, setSupplier] = useState({ value: '', name: '' });
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchSupplierTransactions(true);
  }, [location.state?.refresh]);

  // ── Fetch suppliers ───────────────────────────────────────────────────────
  const fetchSuppliers = async (searchString: string = '') => {
    const suppliers = await supplierService.getSuppliers(searchString);
    if (!suppliers) return;
    setSupplierList(searchString ? suppliers.slice(0, 3) : suppliers);
  };

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { label: item.name, value: item.id.toString(), name: item.name },
  }));

  // ── Fetch transactions ────────────────────────────────────────────────────
  const fetchSupplierTransactions = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      supplierId: supplier.value ? parseInt(supplier.value) : undefined,
    };

    if (!reset && !hasMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await supplierTransactionService.getSupplierTransactions({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (reset) {
        setTransactions(items);
        setPageNumber(2);
      } else {
        setTransactions(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      toast.error('Failed to fetch supplier transactions.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleCreate = () => navigate(SupplierTransactionUrls.create);
  const handleEdit = (id: number) => navigate(SupplierTransactionUrls.edit(id));

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const filters = [supplier?.name, fromDate, toDate].filter(Boolean).join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false);
    fetchSupplierTransactions(true);
  };

  const resetForm = () => {
    setSupplier({ value: '', name: '' });
    setFromDate('');
    seToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchSupplierTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      supplierId: undefined,
    });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = (id: number) => setDeleteId(id);

  const handleDelete = async (id: number) => {
    try {
      await supplierTransactionService.deleteSupplierTransaction(id);
      setDeleteId(null);
      fetchSupplierTransactions(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        'Failed to delete Supplier Transaction.',
      );
    }
  };

  return {
    supplier, setSupplier,
    supplierDetails,
    fromDate, setFromDate,
    toDate, seToDate,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen, setFilterOpen,
    deleteId, setDeleteId,
    fetchSuppliers,
    transactions,
    fetchSupplierTransactions,
    handleCreate,
    handleDeleteConfirm,
    handleDelete,
    handleEdit,
    loading,
    handleSearch,
    handleClearSearch,
  };
};

export { useSupplierTransactiontList };