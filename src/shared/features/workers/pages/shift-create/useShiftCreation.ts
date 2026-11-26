import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShiftService } from '../../service/ShiftService';
import { useShiftInputValidate } from '../../components/InputValidate/ShiftInputValidate';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';
import type { Shift } from '../../DTOs/ShiftProps';
import { toast } from 'sonner';
import { parseApiError } from '@/shared/utils/parseApiError';

export const useShiftCreation = () => {
  const navigate = useNavigate();
  const shiftService = useShiftService();

  const [name, setName] = useState('');
  const [initialEditName, setInitialEditName] = useState('');
  const [shiftDetails, setShiftDetails] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [multiplier, setMultiplier] = useState('');
  const [initialEditMultiplier, setInitialEditMultiplier] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const fetchShift = async () => {
    setLoading(true);
    const shiftData = await shiftService.getShifts('');
    setShiftDetails(shiftData);
    setLoading(false);
  };

  useEffect(() => {
    fetchShift();
  }, []);

  const { error, validate, setError, initialError } = useShiftInputValidate({
    name,
    multiplier,
  });

  const resetFormFields = () => {
    setName('');
    setMultiplier('');
    setInitialEditName('');
    setInitialEditMultiplier('');
    setError(initialError);
    setIsEditing(false);
    setEditingShiftId(null);
  };

  const setEditingShift = (shift: Shift) => {
    setIsEditing(true);
    setEditingShiftId(shift.id);
    setName(shift.name);
    setMultiplier(shift.multiplier);
    setInitialEditName(shift.name);
    setInitialEditMultiplier(shift.multiplier);
  };

  const hasUnsavedChanges = () => {
    if (isEditing) {
      return name !== initialEditName || multiplier !== initialEditMultiplier;
    }
    return name.trim() !== '' || multiplier.trim() !== '';
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleKeepEditing = () => setShowUnsavedDialog(false);

  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    resetFormFields();
    navigate(-2);
  };

  const handleUpdate = async (): Promise<boolean> => {
    if (validate() && editingShiftId !== null) {
      const shift = {
        id: editingShiftId,
        name: name.trim(),
        multiplier: multiplier.trim(),
      };
      try {
        const response = await shiftService.updateShift(editingShiftId, shift);
        if (response) {
          fetchShift();
          resetFormFields();
          setIsEditing(false);
          return true;
        }
        return false;
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to update shift'));
        return false;
      }
    }
    return false;
  };

  const handleSubmission = async (): Promise<boolean> => {
    if (validate()) {
      const shift = {
        name: name.trim(),
        multiplier: multiplier.trim(),
      };
      try {
        const response = await shiftService.createShift(shift);
        if (response.id) {
          fetchShift();
        }
        resetFormFields();
        return true;
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to create shift'));
        return false;
      }
    }
    return false;
  };

  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    if (isEditing) {
      await handleUpdate();
    } else {
      await handleSubmission();
    }
  };

  const handleShiftDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await shiftService.deleteShift(deleteId);
      fetchShift();
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to delete shift'));
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchShift();
    setIsLoading(false);
  };

  const fixedMultipliers = ['0.50', '1.00', '1.50', '2.00'];
  const isFixedMultiplier = isEditing && fixedMultipliers.includes(multiplier);

  return {
    name,
    loading,
    shiftDetails,
    isEditing,
    error,
    editingShiftId,
    isLoading,
    deleteId,
    showUnsavedDialog,
    setName,
    setMultiplier,
    multiplier,
    resetFormFields,
    handleSubmission,
    handleUpdate,
    handleShiftDelete,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    confirmDelete,
    cancelDelete,
    setEditingShift,
    handleRefresh,
    isFixedMultiplier,
  };
};
