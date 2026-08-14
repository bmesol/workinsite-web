import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';        
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { useWorkTypeService } from '../../service/WorkerTypeService';
import { useWorkRateAbstractService } from '../../service/WorkRateAbstractService';
import { WorkRateAbstractUrls } from '../../utils/urls';  
import type { Unit } from '@/shared/features/materials/DTOs/UnitProps';
import { toast } from 'sonner';                        
import type { WorkType } from '../../DTOs/WorkTypeProps';
import { useWorkRateAbstractValidate } from '../../components/InputValidate/WorkRateAbstractValidate';

const useWorkRateAbstractCreate = () => {             
  const navigate = useNavigate();

  const [siteId, setSiteId] = useState('');
  const [workTypeId, setWorkTypeId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [totalRate, setTotalRate] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [allSites, setAllSites] = useState<Site[]>([]);
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);

  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const workRateAbstractService = useWorkRateAbstractService();

  const { error, validate, setError, initialError } = useWorkRateAbstractValidate(
    { siteId, workTypeId, totalRate, totalQuantity, unitId },
  );

  const resetFormFields = () => {
    setSiteId('');
    setWorkTypeId('');
    setUnitId('');
    setTotalRate('');
    setTotalQuantity('');
    setNotes('');
    setAllSites([]);
    setSiteList([]);
    setWorkTypeList([]);
    setUnitList([]);
    setError(initialError);
  };

  useEffect(() => {
    return () => resetFormFields();
  }, []);

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: `${item.name} [${item.unit?.name ?? ''}]`,
    value: item.id.toString(),
  }));

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

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

  const fetchWorkTypes = async (searchString: string = '') => {
    const workTypes = await workTypeService.getWorkTypes(searchString);
    if (!workTypes) return;
    setWorkTypeList(searchString ? workTypes.slice(0, 3) : workTypes);
  };

  const handleWorkTypeChange = (value: string) => {
    setWorkTypeId(value);
    const selected = workTypeList.find(wt => wt.id.toString() === value);
    if (selected?.unit) {
      setUnitId(selected.unit.id.toString());
      setUnitList([{ id: selected.unit.id, name: selected.unit.name }]);
    } else {
      setUnitId('');
      setUnitList([]);
    }
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== '' ||
      workTypeId !== '' ||
      unitId !== '' ||
      totalRate !== '' ||
      totalQuantity !== '' ||
      notes !== ''
    );
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
      const confirmed = window.confirm(
        'You have unsaved changes. Click OK to exit without saving, or Cancel to stay.',
      );
      if (confirmed) {
        resetFormFields();
        navigate(WorkRateAbstractUrls.list);
      }
    } else {
      resetFormFields();
      navigate(WorkRateAbstractUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        const workRateAbstract = {
          siteId: parseInt(siteId),
          workTypeId: parseInt(workTypeId),
          unitId: parseInt(unitId),
          totalRate: totalRate.trim(),
          totalQuantity: totalQuantity.trim(),
          note: notes.trim(),
        };
        await workRateAbstractService.createWorkRateAbstract(workRateAbstract);
        toast.success('Work rate abstract created successfully');  
        resetFormFields();
        navigate(WorkRateAbstractUrls.list);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Failed to create work rate abstract. Please try again.';
        toast.error(errorMsg);
      }
    }
  };

  return {
    siteDetails,
    workTypeDetails,
    error,
    siteId,
    unitId,
    unitDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    handleBackPress,
    hasUnsavedChanges,
    setSiteId,
    fetchSites,
    fetchWorkTypes,
    handleWorkTypeChange,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    handleSubmit,
  };
};

export { useWorkRateAbstractCreate };