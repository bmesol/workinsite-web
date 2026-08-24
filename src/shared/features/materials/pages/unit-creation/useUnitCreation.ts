import { useState, useEffect } from 'react';
import type { Unit } from '../../DTOs/UnitProps';
import { useUnitService } from '../../service/UnitService';
import { useUnitInputValidate } from '../../components/InputValidate/UnitInputValidate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useUnitCreation = () => {
  const navigate = useNavigate();
  const unitService = useUnitService();

  const [name, setName] = useState('');
  const [unitDetails, setUnitDetails] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { error, validate, setError, initialError } = useUnitInputValidate({ name });

  useEffect(() => {
    fetchUnit();
  }, []);

  const fetchUnit = async () => {
    setLoading(true);
    try {
      const data = await unitService.getUnits('');
      setUnitDetails(data);
    } finally {
      setLoading(false);
    }
  };

  const refreshList = async () => {
    const data = await unitService.getUnits('');
    setUnitDetails(data);
  };

  const resetFormFields = () => {
    setName('');
    setError(initialError);
    setIsEditing(false);
    setEditingUnitId(null);
  };

  const setEditingUnit = (unit: { id: number; name: string }) => {
    setIsEditing(true);
    setEditingUnitId(unit.id);
    setName(unit.name);
  };

  // ✅ Create
  const handleSubmission = async () => {
    if (validate()) {
      try {
        const response = await unitService.createUnit({ name: name.trim() });
        if (response.id) refreshList();
        resetFormFields();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to create unit');
      }
    }
  };

  // ✅ Update
  const handleUnitUpdate = async () => {
    if (validate() && editingUnitId !== null) {
      try {
        const response = await unitService.updateUnit(editingUnitId, {
          name: name.trim(),
        });
        if (response) {
          refreshList();
          resetFormFields();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to update unit');
      }
    }
  };

  // ✅ Delete trigger — Alert.alert → dialog state
  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  // ✅ Actual delete
  const handleUnitDelete = async (id: number) => {
    try {
      await unitService.deleteUnit(id);
      setDeleteId(null);
      refreshList(); // ✅ no full page load
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete unit');
      setDeleteId(null);
    }
  };

  // ✅ Back — window.confirm replace Alert.alert
  const handleBackPress = () => {
    if (name.trim() !== '') {
      const confirmed = window.confirm(
        'You have unsaved changes. Click OK to exit without saving, or Cancel to stay.',
      );
      if (confirmed) {
        resetFormFields();
        navigate('/');
      }
    } else {
      resetFormFields();
      navigate('/');
    }
  };

  return {
    name,
    unitDetails,
    loading,
    isEditing,
    error,
    editingUnitId,
    deleteId,
    setDeleteId,
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleUnitUpdate,
    handleUnitDelete,
    confirmDelete,
    setEditingUnit,
  };
};