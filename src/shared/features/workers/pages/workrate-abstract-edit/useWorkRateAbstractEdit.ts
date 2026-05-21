import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';                   
import { useWorkRateAbstractValidate } from '../../components/InputValidate/WorkRateAbstractValidate';
import { useSiteService } from '@/shared/features/sites/service/SiteService';
import type { Site } from '@/shared/features/sites/DTOs/SiteProps';
import { useWorkTypeService } from '@/shared/features/workers/service/WorkerTypeService';
import { useUnitService } from '@/shared/features/materials/service/UnitService';
import { useWorkRateAbstractService } from '../../service/WorkRateAbstractService';
import { toast } from 'sonner';                                    
import type { WorkRateAbstractProps } from '../../DTOs/WorkRateAbstract';
import type { Unit } from '@/shared/features/materials/DTOs/UnitProps';
import type { WorkType } from '@/shared/features/workers/DTOs/WorkTypeProps';
import { WorkRateAbstractUrls } from '../../utils/urls';              

const useWorkRateAbstractEdit = (id: string) => {                
  const navigate = useNavigate();

  const [siteId, setSiteId] = useState('');
  const [workTypeId, setWorkTypeId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [totalRate, setTotalRate] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [siteList, setSiteList] = useState<Site[]>([]);
  const [workTypeList, setWorkTypeList] = useState<WorkType[]>([]);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [workRateAbstract, setWorkRateAbstract] = useState<WorkRateAbstractProps>();

  const siteService = useSiteService();
  const workTypeService = useWorkTypeService();
  const unitService = useUnitService();
  const workRateAbstractService = useWorkRateAbstractService();

  const { error, validate, setError, initialError } = useWorkRateAbstractValidate(
    { siteId, workTypeId, totalRate, totalQuantity, unitId },
  );

  const siteDetails = siteList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const workTypeDetails = workTypeList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  // ✅ { searchString } → searchString (matches SiteService signature)
  const fetchSites = async (searchString: string = '') => {
    const sites = await siteService.getSites({ searchString });
    if (!sites) return;
    setSiteList(searchString ? sites.slice(0, 3) : sites);
  };

  const fetchWorkTypes = async (searchString: string = '') => {
    const workTypes = await workTypeService.getWorkTypes(searchString);
    if (!workTypes) return;
    setWorkTypeList(searchString ? workTypes.slice(0, 3) : workTypes);
  };

  const fetchUnits = async (searchString: string = '') => {
    const units = await unitService.getUnits(searchString, false);
    if (!units) return;
    setUnitList(searchString ? units.slice(0, 3) : units);
  };

  const fetchWorkRateAbstract = async () => {
    setLoading(true);
    try {
      const data: WorkRateAbstractProps =
        await workRateAbstractService.getWorkRateAbstract(parseInt(id));
      setWorkRateAbstract(data);
      setSiteId(data.site?.id?.toString());
      setWorkTypeId(data.workType?.id?.toString());
      setUnitId(data.unit?.id?.toString());
      setTotalRate(data.totalRate?.toString());
      setTotalQuantity(data.totalQuantity?.toString());
      setNotes(data.note);
    } catch (error) {
      toast.error('Failed to fetch work rate abstract data.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ useFocusEffect → useEffect on mount
  useEffect(() => {
    fetchWorkRateAbstract();
  }, [id]);

  // ✅ Fetch site by id when siteId is set (to show label in combobox)
  useEffect(() => {
    const fetchSiteById = async () => {
      if (siteId) {
        try {
          const site = await siteService.getSite(parseInt(siteId));
          setSiteList([site]);
        } catch (error) {
          console.error('Failed to fetch Site:', error);
        }
      }
    };
    fetchSiteById();
  }, [siteId]);

  useEffect(() => {
    const fetchWorkTypeById = async () => {
      if (workTypeId) {
        try {
          const workType = await workTypeService.getWorkType(parseInt(workTypeId));
          setWorkTypeList([workType]);
        } catch (error) {
          console.error('Failed to fetch workType:', error);
        }
      }
    };
    fetchWorkTypeById();
  }, [workTypeId]);

  useEffect(() => {
    const fetchUnitById = async () => {
      if (unitId) {
        try {
          const unit = await unitService.getUnit(parseInt(unitId));
          setUnitList([unit]);
        } catch (error) {
          console.error('Failed to fetch unit:', error);
        }
      }
    };
    fetchUnitById();
  }, [unitId]);

  const resetFormFields = () => {
    setSiteId('');
    setWorkTypeId('');
    setUnitId('');
    setTotalRate('');
    setTotalQuantity('');
    setNotes('');
    setSiteList([]);
    setWorkTypeList([]);
    setUnitList([]);
    setError(initialError);
  };

  const hasUnsavedChanges = () => {
    return (
      siteId !== workRateAbstract?.site?.id.toString() ||
      workTypeId !== workRateAbstract?.workType.id.toString() ||
      unitId !== workRateAbstract?.unit.id.toString() ||
      totalRate !== workRateAbstract?.totalRate.toString() ||
      totalQuantity !== workRateAbstract?.totalQuantity.toString() ||
      notes !== workRateAbstract?.note
    );
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const payload = {
          siteId: parseInt(siteId),
          workTypeId: parseInt(workTypeId),
          unitId: parseInt(unitId),
          totalRate: totalRate.trim(),
          totalQuantity: totalQuantity.trim(),
          note: notes.trim(),
        };
        await workRateAbstractService.updateWorkRateAbstract(parseInt(id), payload);
        toast.success('Work rate abstract updated successfully');
        navigate(WorkRateAbstractUrls.list);
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          'Failed to update work rate abstract. Please try again.';
        toast.error(errorMsg);
      }
    }
  };

  // ✅ Alert.alert → window.confirm
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

  return {
    siteDetails,
    workTypeId,
    totalRate,
    totalQuantity,
    notes,
    siteId,
    unitId,
    error,
    workTypeDetails,
    unitDetails,
    loading,
    hasUnsavedChanges,
    handleBackPress,
    setSiteId,
    handleSubmission,
    setWorkTypeId,
    setUnitId,
    setTotalRate,
    setTotalQuantity,
    setNotes,
    fetchWorkTypes,
    fetchUnits,
    fetchSites,
  };
};

export { useWorkRateAbstractEdit };