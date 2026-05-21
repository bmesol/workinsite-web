import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';          
import type { WorkMode } from '../../DTOs/WorkModeProps';
import { useWorkModeInputValidate } from '../../components/InputValidate/WorkerModeInputValidate';
import { useWorkModeService } from '../../service/WorkerModeService';
import { toast } from 'sonner';    

export const useWorkModeCreation = () => {               
  const navigate = useNavigate();
  const workmodeService = useWorkModeService();

  const [name, setName] = useState('');
  const [workModeDetails, setWorkModeDetails] = useState<WorkMode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkModeId, setEditingWorkModeId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  const { error, validate, setError, initialError } = useWorkModeInputValidate({ name });

  const fetchWorkMode = async () => {
    setLoading(true);
    try {
      const data = await workmodeService.getWorkModes('');
      setWorkModeDetails(data);
    } catch (error: any) {
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
    setError(initialError);
    setIsEditing(false);
    setEditingWorkModeId(null);
  };

  const setEditingWorkMode = (workmode: { id: number; name: string }) => {
    setIsEditing(true);
    setEditingWorkModeId(workmode.id);
    setName(workmode.name);
  };

  const handleWorkModeUpdate = async () => {
    if (validate() && editingWorkModeId !== null) {
      const workmode = { id: editingWorkModeId, name: name.trim() };
      try {
        const response = await workmodeService.updateWorkMode(editingWorkModeId, workmode);
        if (response) {
          toast.success('Work mode updated successfully');
          fetchWorkMode();
          resetFormFields();
          setIsEditing(false);
        }
      } catch (error: any) {
        const errorMsg = error?.response?.data?.[0]?.message || 'Failed to update work mode';
        toast.error(errorMsg);
      }
    }
  };

  const hasUnsavedChanges = () => name.trim() !== '';

  // ✅ Alert.alert → window.confirm
  const handleBackPress = () => {
    if (hasUnsavedChanges()) {
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

  const handleWorkModeDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await workmodeService.deleteWorkMode(deleteId);
      toast.success('Work mode deleted successfully');
      fetchWorkMode();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to delete work mode';
      toast.error(errorMsg);
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleSubmission = async () => {
    if (validate()) {
      const workmode = { name: name.trim() };
      try {
        const response = await workmodeService.createWorkMode(workmode);
        if (response.id) {
          toast.success('Work mode created successfully');
          fetchWorkMode();
        }
        resetFormFields();
      } catch (error: any) {
        const errorMsg = error?.response?.data?.[0]?.message || 'Failed to create work mode';
        toast.error(errorMsg);
      }
    }
  };

  return {
    name,
    workModeDetails,
    loading,
    isEditing,
    error,
    editingWorkModeId,
    deleteId,          
    setName,
    resetFormFields,
    handleSubmission,
    handleBackPress,
    handleWorkModeUpdate,
    handleWorkModeDelete,
    confirmDelete,
    cancelDelete,
    setEditingWorkMode,
  };
};