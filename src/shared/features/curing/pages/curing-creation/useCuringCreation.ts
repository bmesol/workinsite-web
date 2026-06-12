import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringService } from '../../service/CuringService';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import { useCuringInputValidate } from '../../components/InputValidate/CuringInputValidate';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import type { CuringType } from '../../DTOs/CuringTypeProps';
import { CuringUrls } from '../../utils/urls';

export const useCuringCreate = () => {
  const navigate = useNavigate();
  const curingService = useCuringService();
  const curingTypeService = useCuringTypeService();
  const siteService = useSiteService();

  const [siteId, setSiteId] = useState('');
  const [curingTypeId, setCuringTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [curingTypeList, setCuringTypeList] = useState<CuringType[]>([]);

  const { error, validate, setError, initialError } = useCuringInputValidate({
    siteId,
    curingTypeId,
    startDate,
    endDate,
  });

  // Load curing types on mount
  useEffect(() => {
    fetchCuringTypes();
  }, []);

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

  const resetForm = () => {
    setSiteId('');
    setCuringTypeId('');
    setStartDate('');
    setEndDate('');
    setNote('');
    setError(initialError);
  };

  const handleBack = () => navigate(CuringUrls.list);

  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await curingService.createCuring({
        siteId: parseInt(siteId),
        curingTypeId: parseInt(curingTypeId),
        startDate: startDate.trim(),
        endDate: endDate.trim(),
        note: note.trim(),
      });
      resetForm();
      navigate(CuringUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to create curing.',
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
    handleSubmission,
    handleBack,
    resetForm,
  };
};