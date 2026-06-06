import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useMaterialShiftService } from '../../service/MaterialShiftService';
import { useMaterialUsedService, type AvailableMaterial } from '@/shared/features/materials/service/MaterialUsedService';
import { useMaterialShiftInputValidate } from '../../components/InputValidate/MaterialShiftInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { MaterialShiftUrls } from '../../utils/urls';

export const useMaterialShiftEdit = (id: string) => {
  const navigate = useNavigate();
  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialUsedService = useMaterialUsedService();

  const [date, setDate] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [sourceSiteId, setSourceSiteId] = useState('');
  const [targetSiteId, setTargetSiteId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [sourceSiteList, setSourceSiteList] = useState<Site[]>([]);
  const [targetSiteList, setTargetSiteList] = useState<Site[]>([]);
  const [materialShift, setMaterialShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [availableMaterialList, setAvailableMaterialList] = useState<AvailableMaterial[]>([]);
  const [allAvailableMaterials, setAllAvailableMaterials] = useState<AvailableMaterial[]>([]);
  const [maximumAllowedQuantity, setMaximumAllowedQuantity] = useState<string | null>(null);
  const [isFetchingMaterials, setIsFetchingMaterials] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // ─── Validator ────────────────────────────────────────────────────────────
  const { error, validate, setError, initialError } = useMaterialShiftInputValidate({
    date,
    materialId,
    sourceSiteId,
    targetSiteId,
    quantity,
    maximumAllowedQuantity,
  });

  // ─── Load record ──────────────────────────────────────────────────────────
  const fetchMaterialShift = async () => {
    setLoading(true);
    try {
      const data = await materialShiftService.getMaterialShift(parseInt(id));
      setMaterialShift(data);
      setDate(data.date);
      setMaterialId(data.material.id.toString());
      setSourceSiteId(data.sourceSite.id.toString());
      setTargetSiteId(data.targetSite.id.toString());
      setSourceSiteList([data.sourceSite]);
      setTargetSiteList([data.sourceSite, data.targetSite]);
      setQuantity(data.quantity.toString());
      setNotes(data.note);

      // Max allowed quantity
      try {
        const maxQty = await materialShiftService.getMaximumAllowedQuantity(parseInt(id));
        setMaximumAllowedQuantity(maxQty);
      } catch {
        setMaximumAllowedQuantity(null);
      }

      // Available materials for source site
      try {
        const list = await materialUsedService.getAvailableMaterialsBySite(data.sourceSite.id);
        const alreadyInList = (list ?? []).some(m => m.material.id === data.material.id);
        const mergedList = alreadyInList
          ? list ?? []
          : [
              { material: data.material, availableQuantity: data.quantity.toString() },
              ...(list ?? []),
            ];
        setAvailableMaterialList(mergedList);
        setAllAvailableMaterials(mergedList);
      } catch {
        const fallback = [
          { material: data.material, availableQuantity: data.quantity.toString() },
        ];
        setAvailableMaterialList(fallback);
        setAllAvailableMaterials(fallback);
      }
    } catch {
      toast.error('Failed to fetch material shift data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialShift();
  }, [id]);

  // ─── Source site change: reload materials ─────────────────────────────────
  const handleSourceSiteChange = async (newSiteId: string) => {
    setSourceSiteId(newSiteId);
    setMaterialId('');
    setQuantity('');
    setMaximumAllowedQuantity(null);
    setAvailableMaterialList([]);
    setAllAvailableMaterials([]);

    if (!newSiteId) return;
    setIsFetchingMaterials(true);
    try {
      const list = await materialUsedService.getAvailableMaterialsBySite(
        parseInt(newSiteId, 10),
      );
      setAvailableMaterialList(list ?? []);
      setAllAvailableMaterials(list ?? []);
    } catch {
      toast.error('Failed to fetch available materials for this site.');
    } finally {
      setIsFetchingMaterials(false);
    }
  };

  // ─── Dropdown options ─────────────────────────────────────────────────────
  const sourceSiteDetails = sourceSiteList.map(site => ({
    label: site.name,
    value: site.id.toString(),
  }));

  const targetSiteDetails = targetSiteList
    .filter(site => site.id.toString() !== sourceSiteId)
    .map(site => ({
      label: site.name,
      value: site.id.toString(),
    }));

  const materialDetails = availableMaterialList.map(item => ({
    label: `${item.material.name} [${item.material.unit.name}]`,
    value: item.material.id.toString(),
  }));

  // ─── Fetch helpers ────────────────────────────────────────────────────────
  const fetchSourceSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSourceSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchTargetSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setTargetSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchMaterials = async (searchString: string = '') => {
    if (!searchString) {
      setAvailableMaterialList(allAvailableMaterials);
      return;
    }
    const lower = searchString.toLowerCase();
    setAvailableMaterialList(
      allAvailableMaterials.filter(item =>
        item.material.name.toLowerCase().includes(lower),
      ),
    );
  };

  // ─── Unsaved changes ──────────────────────────────────────────────────────
  const hasUnsavedChanges = useCallback(() => {
    return (
      materialId !== materialShift?.material.id.toString() ||
      sourceSiteId !== materialShift?.sourceSite.id.toString() ||
      targetSiteId !== materialShift?.targetSite.id.toString() ||
      quantity !== materialShift?.quantity ||
      date !== materialShift?.date ||
      notes !== materialShift?.note
    );
  }, [materialId, sourceSiteId, targetSiteId, quantity, date, notes, materialShift]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(MaterialShiftUrls.list);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await materialShiftService.updateMaterialShift(parseInt(id), {
        date: date.trim(),
        materialId: parseInt(materialId),
        sourceSiteId: parseInt(sourceSiteId),
        targetSiteId: parseInt(targetSiteId),
        quantity: quantity.trim(),
        note: notes.trim(),
      });
      toast.success('Material Shift updated successfully.');
      navigate(MaterialShiftUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to Edit Material Shift.',
      );
    }
  };

  return {
    date, setDate,
    materialId, setMaterialId,
    sourceSiteId, setSourceSiteId: handleSourceSiteChange,
    targetSiteId, setTargetSiteId,
    quantity, setQuantity,
    notes, setNotes,
    sourceSiteDetails,
    targetSiteDetails,
    materialDetails,
    fetchSourceSites,
    fetchTargetSites,
    fetchMaterials,
    error,
    loading,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    maximumAllowedQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchMaterialShift,
    setError,
    initialError,
  };
};