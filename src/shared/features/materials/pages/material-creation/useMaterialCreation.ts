import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useMaterialInputValidate } from '../../components/InputValidate/MaterialInputValidate';
import type { Unit } from '../../DTOs/UnitProps';
import { useUnitService } from '../../service/UnitService';
import { useMaterialService } from '../../service/MaterialService';
import { MaterialsUrls } from '../../utils/urls';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';

const useMaterialCreation = () => {
  const navigate = useNavigate();
  const unitService = useUnitService();
  const materialService = useMaterialService();

  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useMaterialInputValidate({
    name,
    unitId,
  });

  const fetchUnits = async (searchString: string = '') => {
    const units = await unitService.getUnits(searchString, false);
    if (!units) return;
    setUnitList(searchString ? units.slice(0, 3) : units);
  };

  const unitDetails = unitList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleUnitChange = (value: string) => setUnitId(value);

  const hasUnsavedChanges = () =>
    name.trim() !== '' || unitId !== '' || hsnCode.trim() !== '';

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      return;
    }
    resetFormFields();
    navigate(MaterialsUrls.list);
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    resetFormFields();
    navigate(MaterialsUrls.list);
  };
  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    await handleSubmission(true);
  };

const handleSubmission = async (redirectAfter = true) => {
  if (validate()) {
    try {
      const material = {
        name: name.trim(),
        unitId: parseInt(unitId),
        hsnCode: hsnCode.trim(),
      };
      await materialService.createMaterial(material);
      if (redirectAfter) {
        resetFormFields();
        navigate('/materials', { state: { refresh: true } });
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Create Material';
      toast.error(errorMsg);
    }
  }
};

  const resetFormFields = () => {
    setName('');
    setUnitId('');
    setUnitList([]);
    setHsnCode('');
    setError(initialError);
  };

  return {
    name,
    setName,
    unitId,
    setUnitId,
    unitDetails,
    hsnCode,
    setHsnCode,
    error,
    handleSubmission,
    handleCancel,
    handleUnitChange,
    fetchUnits,
    hasUnsavedChanges,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  };
};

export { useMaterialCreation };