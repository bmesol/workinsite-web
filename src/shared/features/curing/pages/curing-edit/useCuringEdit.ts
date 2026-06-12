import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringService } from '../../service/CuringService';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useCuringInputValidate } from '../../components/InputValidate/CuringInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { CuringType } from '../../DTOs/CuringTypeProps';
import { CuringUrls } from '../../utils/urls';

export const useCuringEdit = (id: string) => {
  const navigate = useNavigate();
  const curingService = useCuringService();
  const curingTypeService = useCuringTypeService();
  const siteService = useSiteService();

  const [siteId, setSiteId] = useState('');
  const [curingTypeId, setCuringTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [curing, setCuring] = useState<any>(null);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [curingTypeList, setCuringTypeList] = useState<CuringType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useCuringInputValidate({
    siteId,
    curingTypeId,
    startDate,
    endDate,
  });

  const fetchCuring = async () => {
    setLoading(true);
    try {
      const data = await curingService.getCuring(parseInt(id));
      setCuring(data);
      setSiteId(data.siteId.id.toString());
      setSiteList([data.siteId]);
      setCuringTypeId(data.curingType.id.toString());
      setCuringTypeList([data.curingType]);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setNote(data.note ?? '');
    } catch {
      toast.error('Failed to fetch curing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuring();
  }, [id]);

  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString, status: 'Working' });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchCuringTypes = async () => {
    const data = await curingTypeService.getCuringTypes();
    if (data) setCuringTypeList(data);
  };

  const siteDetails = siteList.map(s => ({
    label: s.name,
    value: s.id.toString(),
  }));

  const curingTypeDetails = curingTypeList.map(ct => ({
    label: ct.curingType,
    value: ct.id.toString(),
  }));

  const hasUnsavedChanges = useCallback(() => {
    return (
      siteId !== curing?.siteId.id.toString() ||
      curingTypeId !== curing?.curingType.id.toString() ||
      startDate !== curing?.startDate ||
      endDate !== curing?.endDate ||
      note !== (curing?.note ?? '')
    );
  }, [siteId, curingTypeId, startDate, endDate, note, curing]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(CuringUrls.list);
    }
  };

  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await curingService.updateCuring(parseInt(id), {
        siteId: parseInt(siteId),
        curingTypeId: parseInt(curingTypeId),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        note: note.trim(),
      });
      toast.success('Curing updated successfully.');
      navigate(CuringUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to update curing.',
      );
    }
  };

  return {
    siteId, setSiteId,
    curingTypeId, setCuringTypeId,
    startDate, setStartDate,
    endDate, setEndDate,
    note, setNote,
    siteDetails,
    curingTypeDetails,
    fetchSites,
    fetchCuringTypes,
    error,
    loading,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchCuring,
    setError,
    initialError,
  };
};