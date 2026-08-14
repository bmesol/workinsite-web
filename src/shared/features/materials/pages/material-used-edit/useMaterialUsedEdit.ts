import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useWorkModeService } from '@/shared/features/workers/service/WorkerModeService';
import { useMaterialUsedService, type AvailableMaterial } from '../../service/MaterialUsedService';
import { useMaterialUsedInputValidate } from '../../components/InputValidate/MaterialUsedInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { WorkMode } from '@/shared/features/workers/DTOs/WorkModeProps';
import type { MaterialUsed } from '@/shared/features/materials/DTOs/MaterialUsedProps';
import { MaterialUsedUrls } from '../../utils/urls';

export const useMaterialUsedEdit = (id: string) => {
  const navigate = useNavigate();
  const materialUsedService = useMaterialUsedService();
  const siteService = useSiteService();
  const workModeService = useWorkModeService();

  const [siteId, setSiteId] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [workModeId, setWorkModeId] = useState('');
  const [workModeList, setWorkModeList] = useState<WorkMode[]>([]);
  const [materialUsedDetails, setMaterialUsedDetails] = useState<MaterialUsed>();
  const [loading, setLoading] = useState(true);
  const [availableMaterialList, setAvailableMaterialList] = useState<AvailableMaterial[]>([]);
  const [allAvailableMaterials, setAllAvailableMaterials] = useState<AvailableMaterial[]>([]);
  const [maximumAllowedQuantity, setMaximumAllowedQuantity] = useState<string | null>(null);
  const [isFetchingMaterials, setIsFetchingMaterials] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useMaterialUsedInputValidate({
    siteId,
    materialId,
    quantity,
    workModeId,
    date,
    maximumAllowedQuantity,
  });

  // ── Fetch record ──
  const fetchMaterialUsed = async () => {
    setLoading(true);
    try {
      const data = await materialUsedService.getMaterialUsedById(parseInt(id));
      setDate(data.date);
      setMaterialUsedDetails(data);
      setSiteId(data.site.id.toString());
      setSiteList([data.site]);
      setMaterialId(data.material.id.toString());
      setQuantity(data.quantity.toString());
      setWorkModeId(data.workMode.id.toString());
      setWorkModeList([data.workMode]);
      setNotes(data.notes);

      // Fetch maximum allowed quantity
      try {
        const maxQty = await materialUsedService.getMaximumAllowedQuantity(parseInt(id));
        setMaximumAllowedQuantity(maxQty);
      } catch {
        setMaximumAllowedQuantity(null);
      }

      // Fetch available materials for site
      try {
        const list = await materialUsedService.getAvailableMaterialsBySite(data.site.id);
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
      toast.error('Failed to fetch material used data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialUsed();
  }, [id]);

  // ── Site change — reload materials ──
  const handleSiteChange = async (newSiteId: string) => {
    setSiteId(newSiteId);
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
    let source = allSites;
    if (!source.length) {
      const sites = await siteService.getSites({ status: 'Working' });
      if (!sites) return;
      setAllSites(sites);
      source = sites;
    }
    const lower = searchString.toLowerCase();
    setSiteList(
      searchString ? source.filter(s => s.name.toLowerCase().includes(lower)) : source,
    );
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

  const fetchWorkModes = async (searchString: string = '') => {
    const workModes = await workModeService.getWorkModes(searchString);
    if (!workModes) return;
    setWorkModeList(searchString ? workModes.slice(0, 3) : workModes);
  };

  // ── Unsaved changes ──
  const hasUnsavedChanges = useCallback(() => {
    return (
      siteId !== materialUsedDetails?.site.id.toString() ||
      materialId !== materialUsedDetails?.material.id.toString() ||
      workModeId !== materialUsedDetails?.workMode.id.toString() ||
      quantity !== materialUsedDetails?.quantity.toString() ||
      notes !== materialUsedDetails?.notes ||
      date !== materialUsedDetails?.date
    );
  }, [siteId, materialId, workModeId, quantity, notes, date, materialUsedDetails]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(MaterialUsedUrls.list);
    }
  };

  // ── Submit ──
  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await materialUsedService.updateMaterialUsed(parseInt(id), {
        date: date?.trim(),
        siteId: parseInt(siteId),
        materialId: parseInt(materialId),
        workModeId: parseInt(workModeId),
        quantity: quantity?.trim(),
        note: notes?.trim() || '',
      });
      toast.success('Material Used updated successfully.');
      navigate(MaterialUsedUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to Edit Material Used.'
      );
    }
  };

  return {
    siteId,
    setSiteId: handleSiteChange,
    materialId, setMaterialId,
    quantity, setQuantity,
    notes, setNotes,
    date, setDate,
    workModeId, setWorkModeId,
    materialUsedDetails,
    error,
    materialDetails,
    siteDetails,
    workModeDetails,
    loading,
    fetchSites,
    fetchMaterials,
    fetchWorkModes,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    maximumAllowedQuantity,
    isFetchingMaterials,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchMaterialUsed,
    setError,
    initialError,
  };
};