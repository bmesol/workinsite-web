import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useMaterialShiftService } from '../../service/MaterialShiftService';
import { useMaterialUsedService, type AvailableMaterial } from '@/shared/features/materials/service/MaterialUsedService';
import { useMaterialShiftInputValidate } from '../../components/InputValidate/MaterialShiftInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { MaterialShiftCreationRequest } from '../../DTOs/MaterialShiftProps';
import { MaterialShiftUrls } from '../../utils/urls';
import { formatDateToString } from '@/shared/utils/function';

export const useMaterialShiftCreation = () => {
  const navigate = useNavigate();
  const materialShiftService = useMaterialShiftService();
  const siteService = useSiteService();
  const materialUsedService = useMaterialUsedService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [date, setDate] = useState<string>(formatted);
  const [materialId, setMaterialId] = useState('');
  const [sourceSiteId, setSourceSiteId] = useState('');
  const [targetSiteId, setTargetSiteId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');

  const [sourceSiteList, setSourceSiteList] = useState<Site[]>([]);
  const [targetSiteList, setTargetSiteList] = useState<Site[]>([]);
  const [availableMaterialList, setAvailableMaterialList] = useState<AvailableMaterial[]>([]);
  const [allAvailableMaterials, setAllAvailableMaterials] = useState<AvailableMaterial[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState<string | null>(null);
  const [isFetchingMaterials, setIsFetchingMaterials] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // ─── Validator ─────────────────────────────────────────────────────────────
  const { error, validate, setError, initialError } = useMaterialShiftInputValidate({
    date,
    materialId,
    sourceSiteId,
    targetSiteId,
    quantity,
    availableQuantity,
  });

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const resetFormFields = () => {
    setDate(formatted);
    setMaterialId('');
    setSourceSiteId('');
    setTargetSiteId('');
    setQuantity('');
    setNotes('');
    setError(initialError);
    setAvailableMaterialList([]);
    setAllAvailableMaterials([]);
    setAvailableQuantity(null);
  };

  // ─── When sourceSiteId changes: fetch available materials ──────────────────
  useEffect(() => {
    setMaterialId('');
    setQuantity('');
    setAvailableQuantity(null);
    setAvailableMaterialList([]);
    setAllAvailableMaterials([]);

    if (!sourceSiteId) return;

    const loadAvailableMaterials = async () => {
      setIsFetchingMaterials(true);
      try {
        const result = await materialUsedService.getAvailableMaterialsBySite(
          parseInt(sourceSiteId, 10),
        );
        const list = result ?? [];
        setAvailableMaterialList(list);
        setAllAvailableMaterials(list);
      } catch {
        toast.error('Failed to fetch available materials for this site.');
        setAvailableMaterialList([]);
        setAllAvailableMaterials([]);
      } finally {
        setIsFetchingMaterials(false);
      }
    };

    loadAvailableMaterials();
  }, [sourceSiteId]);

  // ─── When materialId changes: update available quantity ───────────────────
  useEffect(() => {
    setQuantity('');
    if (!materialId) {
      setAvailableQuantity(null);
      return;
    }
    const found = allAvailableMaterials.find(
      item => item.material.id.toString() === materialId,
    );
    setAvailableQuantity(found ? found.availableQuantity : null);
  }, [materialId]);

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
    if (!sourceSiteId) return;
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
      date !== formatted ||
      materialId !== '' ||
      sourceSiteId !== '' ||
      targetSiteId !== '' ||
      quantity !== '' ||
      notes !== ''
    );
  }, [date, materialId, sourceSiteId, targetSiteId, quantity, notes, formatted]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(MaterialShiftUrls.list);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      const materialShift: MaterialShiftCreationRequest = {
        date: date.trim(),
        materialId: parseInt(materialId),
        sourceSiteId: parseInt(sourceSiteId),
        targetSiteId: parseInt(targetSiteId),
        quantity: quantity.toString(),
        note: notes.trim(),
      };
      await materialShiftService.createMaterialShift(materialShift);
      resetFormFields();
      navigate(MaterialShiftUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to Create Material Shift.',
      );
    }
  };

  return {
    date, setDate,
    materialId, setMaterialId,
    sourceSiteId, setSourceSiteId,
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
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    availableQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};