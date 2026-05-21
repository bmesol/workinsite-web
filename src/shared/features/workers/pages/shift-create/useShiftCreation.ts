import { useState, useEffect } from 'react';
import { useShiftService } from '../../service/ShiftService';
import { useShiftInputValidate } from '../../components/InputValidate/ShiftInputValidate';
import type { Shift } from '../../DTOs/ShiftProps';
import { toast } from 'sonner';

export const useShiftCreation = () => {
  const shiftService = useShiftService();

  const [name, setName] = useState('');
  const [shiftDetails, setShiftDetails] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [multiplier, setMultiplier] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  const fetchShift = async () => {
    setLoading(true);
    const shiftData = await shiftService.getShifts('');
    setShiftDetails(shiftData);
    setLoading(false);
  };

  // Replaces useIsFocused — fetch on mount
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
    setError(initialError);
    setIsEditing(false);
    setEditingShiftId(null);
  };

  const setEditingShift = (shift: Shift) => {
    setIsEditing(true);
    setEditingShiftId(shift.id);
    setName(shift.name);
    setMultiplier(shift.multiplier);
  };

  const handleUpdate = async () => {
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
        }
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message || 'Failed to update shift';
        toast.error(errorMsg);
      }
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
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || 'Failed to delete shift';
      toast.error(errorMsg);
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleSubmission = async () => {
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
      } catch (error: any) {
        const errorMsg =
          error?.response?.data?.[0]?.message ||
          error?.response?.data?.message ||
          'Failed to create shift';
        toast.error(errorMsg);
      }
    }
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
    setName,
    setMultiplier,
    multiplier,
    resetFormFields,
    handleSubmission,
    handleUpdate,
    handleShiftDelete,
    confirmDelete,           
    cancelDelete,           
    setEditingShift,
    handleRefresh,
    isFixedMultiplier,
  };
};