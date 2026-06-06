import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import { useMaterialUsedService, type AvailableMaterial } from '../../service/MaterialUsedService';
import { useMaterialUsedInputValidate } from '../../components/InputValidate/MaterialUsedInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';
import { MaterialUsedUrls } from '../../utils/urls';
import { formatDateToString } from '@/shared/utils/function';

const useMaterialUsedCreation = () => {
  const navigate = useNavigate();
  const materialUsedService = useMaterialUsedService();
  const siteService = useSiteService();
  const workModeService = useWorkModeService();

  const [siteId, setSiteId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [workModeId, setWorkModeId] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [availableMaterialList, setAvailableMaterialList] = useState<AvailableMaterial[]>([]);
  const [allAvailableMaterials, setAllAvailableMaterials] = useState<AvailableMaterial[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState<string | null>(null);
  const [isFetchingMaterials, setIsFetchingMaterials] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useMaterialUsedInputValidate({
    siteId,
    materialId,
    quantity,
    workModeId,
    date,
    availableQuantity,
  });

  const today = new Date();
  const formatted = formatDateToString(today);

  // ── Set default date on mount ──
  useEffect(() => {
    setDate(formatted);
  }, []);

  // ── Reset ──
  const resetFormFields = () => {
    setSiteId('');
    setMaterialId('');
    setWorkModeId('');
    setQuantity('');
    setNotes('');
    setDate(formatted);
    setError(initialError);
    setAvailableMaterialList([]);
    setAllAvailableMaterials([]);
    setAvailableQuantity(null);
  };

  // ── When siteId changes: fetch available materials ──
  useEffect(() => {
    setMaterialId('');
    setQuantity('');
    setAvailableQuantity(null);
    setAvailableMaterialList([]);
    setAllAvailableMaterials([]);

    if (!siteId) return;

    const loadAvailableMaterials = async () => {
      setIsFetchingMaterials(true);
      try {
        const parsedId = parseInt(siteId, 10);
        const result = await materialUsedService.getAvailableMaterialsBySite(parsedId);
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
  }, [siteId]);

  // ── When materialId changes: update available quantity ──
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

  // ── Dropdown options ──
  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const materialDetails = availableMaterialList.map(item => ({
    label: `${item.material.name} [${item.material.unit.name}]`,
    value: item.material.id.toString(),
  }));

  const workModeDetails = workModeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // ── Fetch helpers ──
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  // Client-side filter — no extra API call
  const fetchMaterials = async (searchString: string = '') => {
    if (!siteId) return;
    if (!searchString) {
      setAvailableMaterialList(allAvailableMaterials);
      return;
    }
    const lower = searchString.toLowerCase();
    const filtered = allAvailableMaterials.filter(item =>
      item.material.name.toLowerCase().includes(lower),
    );
    setAvailableMaterialList(filtered);
  };

  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    if (!workModes) return;
    setWorkModeList(searchString ? workModes.slice(0, 3) : workModes);
  };

  // ── Unsaved changes guard ──
  const hasUnsavedChanges = useCallback(() => {
    return (
      siteId !== '' ||
      materialId !== '' ||
      workModeId !== '' ||
      quantity.trim() !== '' ||
      notes.trim() !== '' ||
      date !== formatted
    );
  }, [siteId, materialId, workModeId, quantity, notes, date, formatted]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(MaterialUsedUrls.list);
    }
  };

  // ── Submit ──
  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await materialUsedService.createMaterialUsed({
        date: date.trim(),
        siteId: parseInt(siteId),
        materialId: parseInt(materialId),
        workModeId: parseInt(workModeId),
        quantity: quantity.trim(),
        note: notes.trim(),
      });
      toast.success('Material Used created successfully.');
      resetFormFields();
      navigate(MaterialUsedUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message || 'Failed to Create Material Used.'
      );
    }
  };

  return {
    siteId, setSiteId,
    materialId, setMaterialId,
    quantity, setQuantity,
    notes, setNotes,
    date, setDate,
    workModeId, setWorkModeId,
    siteDetails,
    materialDetails,
    workModeDetails,
    error,
    fetchWorkModes,
    fetchSites,
    fetchMaterials,
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

export { useMaterialUsedCreation };