import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { WorkMode } from '../../DTOs/WorkModeProps';
import { useWorkModeInputValidate } from '../../components/InputValidate/WorkerModeInputValidate';
import { useWorkModeService } from '../../service/WorkerModeService';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';
import { toast } from 'sonner';
import { parseApiError } from '@/shared/utils/parseApiError';

export const useWorkModeCreation = () => {
  const navigate = useNavigate();
  const workmodeService = useWorkModeService();

  const [name, setName] = useState('');
  const [initialEditName, setInitialEditName] = useState('');
  const [workModeDetails, setWorkModeDetails] = useState<WorkMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkModeId, setEditingWorkModeId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useWorkModeInputValidate({ name });

  const fetchWorkMode = async () => {
    setLoading(true);
    try {
      const data = await workmodeService.getWorkModes('');
      setWorkModeDetails(data);
    } catch (error: unknown) {
      toast.error('Failed to fetch work modes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkMode();
  }, []);

  const resetFormFields = () => {
    setName('');
    setInitialEditName('');
    setError(initialError);
    setIsEditing(false);
    setEditingWorkModeId(null);
  };

  const setEditingWorkMode = (workmode: { id: number; name: string }) => {
    setIsEditing(true);
    setEditingWorkModeId(workmode.id);
    setName(workmode.name);
    setInitialEditName(workmode.name);
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

  const handleWorkModeUpdate = async (): Promise<boolean> => {
    if (validate() && editingWorkModeId !== null) {
      const workmode = { id: editingWorkModeId, name: name.trim() };
      try {
        const response = await workmodeService.updateWorkMode(editingWorkModeId, workmode);
        if (response) {
          toast.success('Work mode updated successfully');
          fetchWorkMode();
          resetFormFields();
          return true;
        }
        return false;
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to update work mode'));
        return false;
      }
    }
    return false;
  };

  const handleSubmission = async (): Promise<boolean> => {
    if (validate()) {
      const workmode = { name: name.trim() };
      try {
        const response = await workmodeService.createWorkMode(workmode);
        if (response.id) {
          toast.success('Work mode created successfully');
          fetchWorkMode();
        }
        resetFormFields();
        return true;
      } catch (error: unknown) {
        toast.error(parseApiError(error, 'Failed to create work mode'));
        return false;
      }
    }
    return false;
  };

  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    if (isEditing) {
      await handleWorkModeUpdate();
    } else {
      await handleSubmission();
    }
  };

  const handleWorkModeDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await workmodeService.deleteWorkMode(deleteId);
      toast.success('Work mode deleted successfully');
      fetchWorkMode();
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to delete work mode'));
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  return {
    name,
    workModeDetails,
    loading,
    isEditing,
    error,
    editingWorkModeId,
    deleteId,
    showUnsavedDialog,
    setName,
    resetFormFields,
    handleSubmission,
    handleWorkModeUpdate,
    handleWorkModeDelete,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
    confirmDelete,
    cancelDelete,
    setEditingWorkMode,
  };
};
