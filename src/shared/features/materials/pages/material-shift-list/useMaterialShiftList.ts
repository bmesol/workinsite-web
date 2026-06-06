import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterialShiftService } from '../../service/MaterialShiftService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useMaterialService } from '@/shared/features/materials/service/MaterialService';
import type { MaterialShift } from '../../DTOs/MaterialShiftProps';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { Material } from '@/shared/features/materials/DTOs/MaterialProps';
import { MaterialShiftUrls } from '../../utils/urls';

export const useMaterialShiftList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialService = useMaterialService();

  const [materialShiftDetails, setMaterialShiftDetails] = useState<MaterialShift[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [materialId, setMaterialId] = useState({ value: '', name: '' });
  const [sourceSiteId, setSourceSiteId] = useState({ value: '', name: '' });
  const [targetSiteId, setTargetSiteId] = useState({ value: '', name: '' });
  const [date, setDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [materialList, setMaterialList] = useState<Material[]>([]);

  // ── Fetch on mount / navigation refresh ──
  useEffect(() => {
    fetchMaterialShifts(true);
  }, [location.state?.refresh]);

  // ── Fetch Material Shifts ──
  const fetchMaterialShifts = async (resetList = false, overrideFilters?: any) => {
    const filters = overrideFilters || {
      materialId: materialId.value ? parseInt(materialId.value) : undefined,
      sourceSiteId: sourceSiteId.value ? parseInt(sourceSiteId.value) : undefined,
      targetSiteId: targetSiteId.value ? parseInt(targetSiteId.value) : undefined,
      date: date || undefined,
      quantity: quantity || undefined,
    };

    if (!resetList && !hasMore) return;

    if (resetList) {
      setLoading(true);
      setPageNumber(1);
    } else {
      setPaginationLoading(true);
    }

    try {
      const response = await materialShiftService.getMaterialShifts({
        ...filters,
        pageNumber: resetList ? 1 : pageNumber,
        pageSize,
      });

      const items = response.items || [];

      if (resetList) {
        setMaterialShiftDetails(items);
        setPageNumber(2);
      } else {
        setMaterialShiftDetails(prev => [...prev, ...items]);
        setPageNumber(prev => prev + 1);
      }

      setHasMore(response.totalPages > response.pageNumber);
    } catch (error) {
      toast.error('Failed to fetch material shifts.');
    } finally {
      setLoading(false);
      setPaginationLoading(false);
    }
  };

  // ── Search ──
  const handleSearch = () => {
    const filters = [date, materialId?.name, sourceSiteId?.name, targetSiteId?.name, quantity]
      .filter(Boolean)
      .join(', ');
    setAppliedFilters(filters || 'Search');
    setFilterOpen(false);
    fetchMaterialShifts(true);
  };

  // ── Reset ──
  const resetForm = () => {
    setMaterialId({ value: '', name: '' });
    setSourceSiteId({ value: '', name: '' });
    setTargetSiteId({ value: '', name: '' });
    setDate('');
    setQuantity('');
    setAppliedFilters('');
  };

  // ── Clear Search ──
  const handleClearSearch = () => {
    resetForm();
    fetchMaterialShifts(true, {
      materialId: undefined,
      sourceSiteId: undefined,
      targetSiteId: undefined,
      date: undefined,
      quantity: undefined,
    });
  };

  // ── Delete ──
  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDeleteMaterialShift = async (id: number) => {
    try {
      await materialShiftService.deleteMaterialShift(id);
      setDeleteId(null);
      fetchMaterialShifts(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete Material Shift.',
      );
    }
  };

  // ── Navigation ──
  const handleEditMaterialShift = (id: number) =>
    navigate(MaterialShiftUrls.edit(id));

  const handleAddShift = () => navigate(MaterialShiftUrls.create);

  // ── Fetch helpers ──
  const fetchMaterials = async (searchString: string = '') => {
    const materials = await materialService.getMaterials(searchString);
    if (!materials) return;
    setMaterialList(searchString ? materials.slice(0, 3) : materials);
  };

  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  // ── Dropdown options ──
  const siteDetails = siteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
    allItems: { value: site.id.toString(), name: site.name },
  }));

  const materialDetails = materialList.map(material => ({
    label: material.name,
    value: material.id.toString(),
    allItems: { value: material.id.toString(), name: material.name },
  }));

  return {
    materialShiftDetails,
    loading,
    paginationLoading,
    hasMore,
    fetchMaterialShifts,
    handleSearch,
    handleClearSearch,
    confirmDelete,
    deleteId,
    setDeleteId,
    handleDeleteMaterialShift,
    handleEditMaterialShift,
    handleAddShift,
    materialId, setMaterialId,
    sourceSiteId, setSourceSiteId,
    targetSiteId, setTargetSiteId,
    date, setDate,
    quantity, setQuantity,
    fetchSites,
    fetchMaterials,
    siteDetails,
    materialDetails,
    appliedFilters,
    filterOpen,
    setFilterOpen,
  };
};