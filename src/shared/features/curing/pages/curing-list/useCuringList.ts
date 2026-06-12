import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringService } from '../../service/CuringService';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import type { CuringDTO } from '../../DTOs/CuringProps';
import type { CuringType } from '../../DTOs/CuringTypeProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { CuringUrls } from '../../utils/urls';

const useCuringList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const curingService = useCuringService();
  const curingTypeService = useCuringTypeService();
  const siteService = useSiteService();

  const [curingList, setCuringList] = useState<CuringDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filter states
  const [siteName, setSiteName] = useState({ value: '', name: '' });
  const [curingType, setCuringType] = useState({ value: '', name: '' });

  // Dropdown lists
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [curingTypeList, setCuringTypeList] = useState<CuringType[]>([]);

  useEffect(() => {
    fetchCuringTypes();
    fetchCurings();
  }, [location.state?.refresh]);

  // ── Fetch helpers ─────────────────────────────────────────────────────────
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchCuringTypes = async () => {
    const data = await curingTypeService.getCuringTypes();
    if (data) setCuringTypeList(data);
  };

  // ── Dropdown options ──────────────────────────────────────────────────────
  const siteDetails = siteList.map(s => ({
    label: s.name,
    value: s.id.toString(),
    allItems: { value: s.id.toString(), name: s.name },
  }));

  const curingTypeDetails = curingTypeList.map(ct => ({
    label: ct.curingType,
    value: ct.id.toString(),
    allItems: { value: ct.id.toString(), name: ct.curingType },
  }));

  // ── Fetch curings ─────────────────────────────────────────────────────────
  const fetchCurings = async (overrideFilters?: any) => {
    setLoading(true);
    try {
      const filters = overrideFilters ?? {
        SiteName: siteName.name || undefined,
        CuringTypeId: curingType.value ? parseInt(curingType.value) : undefined,
      };
      const curingData = await curingService.getCurings(filters);
      setCuringList(Array.isArray(curingData) ? curingData : []);
    } catch {
      toast.error('Failed to fetch curings.');
    } finally {
      setLoading(false);
    }
  };

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const labels = [siteName.name, curingType.name].filter(Boolean).join(', ');
    setAppliedFilters(labels || '');
    setFilterOpen(false);
    fetchCurings();
  };

  const handleClearSearch = () => {
    setSiteName({ value: '', name: '' });
    setCuringType({ value: '', name: '' });
    setAppliedFilters('');
    fetchCurings({ SiteName: undefined, CuringTypeId: undefined });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = (id: number) => setDeleteId(id);

  const handleCuringDelete = async (id: number) => {
    try {
      await curingService.deleteCuring(id);
      setDeleteId(null);
      fetchCurings();
    } catch (error: any) {
      const msg =
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to delete curing.';
      toast.error(msg);
    }
  };

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleEditCuring = (id: number) => navigate(CuringUrls.edit(id));
  const handlePress = () => navigate(CuringUrls.create);

  return {
    curingList,
    loading,
    appliedFilters,
    filterOpen, setFilterOpen,
    deleteId, setDeleteId,
    siteName, setSiteName,
    curingType, setCuringType,
    siteDetails,
    curingTypeDetails,
    fetchSites,
    fetchCuringTypes,
    fetchCurings,
    handleEditCuring,
    handleCuringDelete,
    confirmDelete,
    handleSearch,
    handleClearSearch,
    handlePress,
  };
};

export { useCuringList };