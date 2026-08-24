import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWorkerTransactionService } from '../../service/WorkerTransactionService';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import type { WorkerTransactionProps } from '../../DTOs/WorkerTransaction';
import type { Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import { WorkerTransactionUrls } from '../../utils/urls';

const PAGE_SIZE = 3;

const useWorkerTransactionList = () => {
  const navigate = useNavigate();
  const workerTransactionService = useWorkerTransactionService();
  const workerService = useWorkerService();

  const [transactions, setTransactions] = useState<WorkerTransactionProps[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [worker, setWorker] = useState({ value: '', name: '' });
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false); 
  const [deleteId, setDeleteId] = useState<number | null>(null); 

   const fetchWorkers = async (WorkerName: string = '') => {
  const workers = await workerService.getWorkers({ WorkerName });
  if (!workers) return;
  setWorkerList(WorkerName ? workers.slice(0, 3) : workers);
};

  const workerDetails = workerList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: {
      label: item.name,
      value: item.id.toString(),
      name: item.name,
    },
  }));

  const fetchWorkerTransactions = async (
    reset = false,
    overrideFilters?: any,
  ) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      workerId: worker.value ? parseInt(worker.value) : undefined,
    };

    if (!reset && !hasMore) return;
    reset ? setLoading(true) : setPaginationLoading(true);

    try {
      const response = await workerTransactionService.getWorkerTransactions({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize: PAGE_SIZE,
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
      console.error('Error fetching WorkerTransactions:', error);
      toast.error('Failed to fetch worker transactions.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerTransactions(true);
  }, []);

  const handleCreate = () => {
    navigate(WorkerTransactionUrls.create);
  };

  const handleEdit = (id: number) => {
    navigate(WorkerTransactionUrls.edit(id));
  };

  const handleSearch = () => {
    const filters = [worker?.name, fromDate, toDate].filter(Boolean).join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false); // ✅ close dialog
    fetchWorkerTransactions(true);
  };

  const resetForm = () => {
    setWorker({ value: '', name: '' });
    setFromDate('');
    setToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchWorkerTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      workerId: undefined,
    });
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id); 
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await workerTransactionService.deleteWorkerTransaction(deleteId);
      setDeleteId(null);
      fetchWorkerTransactions(true);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete Worker Transaction';
      toast.error(errorMsg);
      setDeleteId(null);
    }
  };

  return {
    worker,
    workerDetails,
    setWorker,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen,       
    setFilterOpen,     
    deleteId,          
    setDeleteId,      
    fetchWorkers,
    transactions,
    fetchWorkerTransactions,
    handleCreate,
    handleDeleteConfirm,
    confirmDelete,
    handleEdit,
    loading,
    handleSearch,
    handleClearSearch,
  };
};

export { useWorkerTransactionList };