import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterialUsedService } from '../../service/MaterialUsedService';
import { useMaterialService } from '@/shared/features/materials/service/MaterialService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';
import type { MaterialUsed } from '../../DTOs/MaterialUsedProps';
import { MaterialUsedUrls } from '../../utils/urls'; // adjust path

const useMaterialUsedList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const materialService = useMaterialService();
  const siteService = useSiteService();
  const workModeService = useWorkModeService();
  const materialUsedService = useMaterialUsedService();

  const [materialUsedDetails, setMaterialUsedDetails] = useState<MaterialUsed[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [date, setDate] = useState('');
  const [material, setMaterial] = useState({ value: '', name: '' });
  const [site, setSite] = useState({ value: '', name: '' });
  const [workMode, setWorkMode] = useState({ value: '', name: '' });
  const [quantity, setQuantity] = useState('');

  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  useEffect(() => {
    fetchMaterialUsed(true);
  }, [location.state?.refresh]);

  // ── Fetch Materials ──
  const fetchMaterials = async (searchString: string = '') => {
    const materials = await materialService.getMaterials(searchString);
    if (!materials) return;
    setMaterialList(searchString ? materials.slice(0, 3) : materials);
  };

  // ── Fetch Sites ──
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  // ── Fetch Work Modes ──
  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    if (!workModes) return;
    setWorkModeList(searchString ? workModes.slice(0, 3) : workModes);
  };

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const materialDetails = materialList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
    allItems: { value: item.id.toString(), name: item.name },
  }));

  // ── Fetch Material Used ──
  const fetchMaterialUsed = async (reset = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      date: date || undefined,
      siteId: site.value ? parseInt(site.value) : undefined,
      materialId: material.value ? parseInt(material.value) : undefined,
      quantity: quantity || undefined,
      workModeId: workMode.value ? parseInt(workMode.value) : undefined,
    };

    if (!reset && !hasMore) return;

    if (reset) {
      setLoading(true);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await materialUsedService.getMaterialsUsed({
        ...filters,
        pageNumber: reset ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (reset) {
        setMaterialUsedDetails(items);
        setPageNumber(2);
      } else {
        setMaterialUsedDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      toast.error('Failed to fetch Material Used.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // ── Handle Edit ──
  const handleMaterialUsedEdit = (id: number) =>
    navigate(MaterialUsedUrls.edit(id));

  // ── Confirm Delete ──
  const confirmDelete = (id: number) => setDeleteId(id);

  // ── Handle Delete ──
  const handleDeleteMaterialUsed = async (id: number) => {
    try {
      await materialUsedService.deleteMaterialUsed(id);
      setDeleteId(null);
      fetchMaterialUsed(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Material Used.'
      );
    }
  };

  // ── Handle Search ──
  const handleSearch = () => {
    const filters = [date, material?.name, site?.name, workMode?.name, quantity]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false);
    fetchMaterialUsed(true);
  };

  // ── Reset Form ──
  const resetForm = () => {
    setSite({ value: '', name: '' });
    setMaterial({ value: '', name: '' });
    setWorkMode({ value: '', name: '' });
    setDate('');
    setQuantity('');
    setAppliedFilters('');
  };

  // ── Clear Search ──
  const handleClearSearch = () => {
    resetForm();
    fetchMaterialUsed(true, {
      date: undefined,
      siteId: undefined,
      materialId: undefined,
      quantity: undefined,
      workModeId: undefined,
    });
  };

  // ── Navigate to Create ──
  const handlePress = () => navigate(MaterialUsedUrls.create);

  return {
    site, setSite,
    date, setDate,
    material, setMaterial,
    workMode, setWorkMode,
    quantity, setQuantity,
    siteDetails,
    materialDetails,
    workModeDetails,
    hasMore,
    materialUsedDetails,
    loading,
    paginationLoading,
    appliedFilters,
    filterOpen,
    setFilterOpen,
    deleteId,
    setDeleteId,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    fetchMaterialUsed,
    handleMaterialUsedEdit,
    confirmDelete,
    handleDeleteMaterialUsed,
    handleClearSearch,
    handlePress,
    handleSearch,
  };
};

export { useMaterialUsedList };