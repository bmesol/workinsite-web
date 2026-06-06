import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterialPurchaseService } from '../../service/PurchaseService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import type { Purchase } from '../../DTOs/PurchaseProps';
import { PurchaseUrls } from '../../utils/urls';

export const usePurchaseList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const materialPurchaseService = useMaterialPurchaseService();
  const siteService = useSiteService();
  const supplierService = useSupplierService();

  const [purchaseDetails, setPurchaseDetails] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState();
  const [hasMore, setHasMore] = useState(true);
  const [siteId, setSiteId] = useState<{ value: string; name: string }>({ value: '', name: '' });
  const [supplierId, setSupplierId] = useState<{ value: string; name: string }>({ value: '', name: '' });
  const [billNumber, setBillNumber] = useState('');
  const [date, setDate] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchPurchases(true);
  }, [location.state?.refresh]);

  const fetchPurchases = async (resetList = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      siteId: siteId.value ? parseInt(siteId.value) : undefined,
      billNumber: billNumber || undefined,
      supplierId: supplierId.value ? parseInt(supplierId.value) : undefined,
      date: date || undefined,
    };

    if (!resetList && !hasMore) return;

    if (resetList) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await materialPurchaseService.getMaterialPurchases({
        ...filters,
        pageNumber: resetList ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (resetList) {
        setPurchaseDetails(items);
        setPageNumber(2);
      } else {
        setPurchaseDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
    } catch (error: any) {
      toast.error('Failed to fetch Purchase.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  const handleSearch = () => {
    const filters = [date, siteId?.name, supplierId?.name, billNumber]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false);
    fetchPurchases(true);
  };

  const resetForm = () => {
    setSiteId({ value: '', name: '' });
    setSupplierId({ value: '', name: '' });
    setBillNumber('');
    setDate('');
    setAppliedFilters('');
  };

  const handleClearSearch = async () => {
    resetForm();
    fetchPurchases(true, {
      billNumber: undefined,
      siteId: undefined,
      supplierId: undefined,
      date: undefined,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchases(true).finally(() => setRefreshing(false));
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleDeletePurchase = async (id: number) => {
    try {
      await materialPurchaseService.deleteMaterialPurchase(id);
      setDeleteId(null);
      fetchPurchases(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Purchase.'
      );
    }
  };

  const handleEditPurchase = (id: number) => {
  navigate(PurchaseUrls.edit(id));
};

const handleAddPurchase = () => {
  navigate(PurchaseUrls.create);
};
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchSuppliers = async (searchString: string = '') => {
    const suppliers = await supplierService.getSuppliers(searchString);
    if (!suppliers) return;
    setSupplierList(searchString ? suppliers.slice(0, 3) : suppliers);
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  return {
    purchaseDetails,
    loading,
    paginationLoading,
    refreshing,
    hasMore,
    fetchPurchases,
    handleSearch,
    handleClearSearch,
    handleRefresh,
    confirmDelete,
    handleDeletePurchase,
    handleEditPurchase,
    handleAddPurchase,
    billNumber,
    setBillNumber,
    date,
    setDate,
    siteId,
    setSiteId,
    supplierId,
    setSupplierId,
    fetchSites,
    fetchSuppliers,
    siteDetails,
    supplierDetails,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    deleteId,
    setDeleteId,
  };
};