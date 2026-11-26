import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useCuringTypeInputValidate } from '../../components/InputValidate/CuringTypeInputValidate';
import { CuringTypeUrls } from '../../utils/urls';
import { parseApiError } from '@/shared/utils/parseApiError';
import { useUnsavedChangesGuard } from '@/shared/hooks/useUnsavedChangesGuard';

export const useCuringTypeCreate = () => {
  const navigate = useNavigate();
  const curingTypeService = useCuringTypeService();

  const [curingType, setCuringType] = useState('');
  const [remark, setRemark] = useState('');
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } =
    useCuringTypeInputValidate({ curingType, remark });

  const resetForm = () => {
    setCuringType('');
    setRemark('');
    setError(initialError);
  };

  const hasUnsavedChanges = () =>
    curingType.trim() !== '' ||
    remark.trim() !== '';

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      return;
    }
    navigate(CuringTypeUrls.list);
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigate(CuringTypeUrls.list);
  };
  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    await handleSubmission();
  };

  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await curingTypeService.createCuringType({
        curingType: curingType.trim(),
        remark: remark.trim(),
      });
      resetForm();
      navigate(CuringTypeUrls.list);
    } catch (error: unknown) {
      toast.error(parseApiError(error, 'Failed to create curing type.'));
    }
  };

  return {
    curingType, setCuringType,
    remark, setRemark,
    error,
    handleSubmission,
    handleCancel,
    resetForm,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  };
};