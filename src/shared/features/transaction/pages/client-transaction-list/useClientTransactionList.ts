import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useClientTransactionService } from '../../service/ClientTransactionService';
import { useClientService } from '@/shared/features/clients/service/ClientService';
import type { ClientTransactionProps } from '../../DTOs/ClientTransaction';
import type { Client } from '@/shared/features/clients/DTOs/ClientProps';
import { ClientTransactionUrls } from '../../utils/urls';

const useClienTransactiontList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clientTransactionService = useClientTransactionService();
  const clientService = useClientService();

  const [transactions, setTransactions] = useState<ClientTransactionProps[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, seToDate] = useState('');
  const [client, setClient] = useState({ value: '', name: '' });
  const [clientList, setClientList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchTransactions(true);
  }, [location.state?.refresh]);

  // ── Fetch clients ─────────────────────────────────────────────────────────
  const fetchClients = async (searchString: string = '') => {
    const clients = await clientService.getClients(searchString, false);
    if (!clients) return;
    setClientList(searchString ? clients.slice(0, 3) : clients);
  };

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { label: item.name, value: item.id.toString(), name: item.name },
  }));

  // ── Fetch transactions ────────────────────────────────────────────────────
  const fetchTransactions = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      clientId: client.value ? parseInt(client.value) : undefined,
    };

    if (!reset && !hasMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await clientTransactionService.getClientTransactions({
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
      toast.error('Failed to fetch client transactions.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleCreate = () => navigate(ClientTransactionUrls.create);
  const handleEdit = (id: number) => navigate(ClientTransactionUrls.edit(id));

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const filters = [client?.name, fromDate, toDate].filter(Boolean).join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false);
    fetchTransactions(true);
  };

  const resetForm = () => {
    setClient({ value: '', name: '' });
    setFromDate('');
    seToDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = () => {
    resetForm();
    fetchTransactions(true, {
      fromDate: undefined,
      toDate: undefined,
      clientId: undefined,
    });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = (id: number) => setDeleteId(id);

  const handleDelete = async (id: number) => {
    try {
      await clientTransactionService.deleteClientTransaction(id);
      setDeleteId(null);
      fetchTransactions(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        'Failed to delete Client Transaction.',
      );
    }
  };

  return {
    client, setClient,
    clientDetails,
    fromDate, setFromDate,
    toDate, seToDate,
    paginationLoading,
    hasMore,
    appliedFilters,
    filterOpen, setFilterOpen,
    deleteId, setDeleteId,
    fetchClients,
    transactions,
    fetchTransactions,
    handleCreate,
    handleDeleteConfirm,
    handleDelete,
    handleEdit,
    loading,
    handleSearch,
    handleClearSearch,
  };
};

export { useClienTransactiontList };