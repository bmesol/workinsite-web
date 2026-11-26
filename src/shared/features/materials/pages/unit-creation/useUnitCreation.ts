import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Unit } from '../../DTOs/UnitProps';
import { useUnitService } from '../../service/UnitService';
import { useUnitInputValidate } from '../../components/InputValidate/UnitInputValidate';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';
import { toast } from 'sonner';
import { parseApiError } from '@/shared/utils/parseApiError';

export const useUnitCreation = () => {
  const navigate = useNavigate();
  const unitService = useUnitService();

  const [name, setName] = useState('');
  const [initialEditName, setInitialEditName] = useState('');
  const [unitDetails, setUnitDetails] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

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
    setInitialEditName('');
    setError(initialError);
    setIsEditing(false);
    setEditingUnitId(null);
  };

  const setEditingUnit = (unit: { id: number; name: string }) => {
    setIsEditing(true);
    setEditingUnitId(unit.id);
    setName(unit.name);
    setInitialEditName(unit.name);
  };

  const hasUnsavedChanges = () => {
    if (isEditing) {
      return name !== initialEditName;
    }
    return name.trim() !== '';
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleKeepEditing = () => setShowUnsavedDialog(false);

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    resetFormFields();
    navigate(-2);
  };

  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    if (isEditing) {
      await handleUnitUpdate();
    } else {
      await handleSubmission();
    }
  };

  const handleSubmission = async () => {
    if (validate()) {
      try {
        const response = await unitService.createUnit({ name: name.trim() });
        if (response.id) refreshList();
        resetFormFields();
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to create unit'));
      }
    }
  };

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
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to update unit'));
      }
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleUnitDelete = async (id: number) => {
    try {
      await unitService.deleteUnit(id);
      setDeleteId(null);
      refreshList();
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to delete unit'));
      setDeleteId(null);
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
    showUnsavedDialog,
    setDeleteId,
    setName,
    resetFormFields,
    handleSubmission,
    handleUnitUpdate,
    handleUnitDelete,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    confirmDelete,
    setEditingUnit,
  };
};
