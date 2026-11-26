import { useState, useEffect } from 'react';
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUnitService } from '../../service/UnitService';
import { useMaterialInputValidate } from '../../components/InputValidate/MaterialInputValidate';
import type { Unit } from '../../DTOs/UnitProps';
import type { Material } from '../../DTOs/MaterialProps';
import { useMaterialService } from '../../service/MaterialService';

export const useMaterialEdit = (id: string) => {
  const navigate = useNavigate();
  const materialService = useMaterialService();
  const unitService = useUnitService();

  const [materialDetails, setMaterialDetails] = useState<Material>();
  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useMaterialInputValidate({
    name,
    unitId,
  });

  useEffect(() => {
    fetchMaterial();
  }, []);

  useEffect(() => {
    const fetchUnitById = async () => {
      if (unitId) {
        const unit = await unitService.getUnit(parseInt(unitId));
        setUnitList([unit]);
      }
    };
    fetchUnitById();
  }, [unitId]);

  const fetchMaterial = async () => {
    setLoading(true);
    try {
      const materialData: Material = await materialService.getMaterial(parseInt(id));
      setMaterialDetails(materialData);
      setName(materialData.name);
      setHsnCode(materialData.hsnCode);
      setUnitId(materialData.unit?.id.toString());
    } catch {
      toast.error('Failed to fetch material data.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUnitCreate = (searchString: string) => {
    navigate(`/materials/unit/create`, {
      state: { name: searchString, redirect: `/materials/${id}/edit`, id },
    });
  };

  const hasUnsavedChanges = () => {
    if (!materialDetails) return false;
    return (
      name !== materialDetails.name ||
      hsnCode !== materialDetails.hsnCode ||
      unitId !== materialDetails.unit?.id.toString()
    );
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate('/materials');
    }
  };

  const handleKeepEditing = () => setShowUnsavedDialog(false);

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigate('/materials');
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
          hsnCode: hsnCode.trim(),
          unitId: parseInt(unitId),
        };
        await materialService.updateMaterial(parseInt(id), material);
        if (redirectAfter) {
          navigate('/materials');
        }
      } catch (err: unknown) {
        const e = err as { response?: { data?: Array<{ message?: string }> } };
        const errorMsg =
          e?.response?.data?.[0]?.message || 'Failed to Edit Material';
        toast.error(errorMsg);
      }
    }
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
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    handleUnitCreate,
    handleUnitChange,
    fetchUnits,
    hasUnsavedChanges,
    showUnsavedDialog,
    loading,
  };
};