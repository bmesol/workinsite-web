import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useCuringTypeInputValidate } from '../../components/InputValidate/CuringTypeInputValidate';
import { CuringTypeUrls } from '../../utils/urls';

export const useCuringTypeEdit = (id: string) => {
  const navigate = useNavigate();
  const curingTypeService = useCuringTypeService();

  const [curingType, setCuringType] = useState('');
  const [remark, setRemark] = useState('');
  const [original, setOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } =
    useCuringTypeInputValidate({ curingType, remark });

  const fetchCuringType = async () => {
    setLoading(true);
    try {
      const data = await curingTypeService.getCuringType(parseInt(id));
      setOriginal(data);
      setCuringType(data.curingType);
      setRemark(data.remark ?? '');
    } catch {
      toast.error('Failed to fetch curing type.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuringType();
  }, [id]);

  const hasUnsavedChanges = useCallback(
    () =>
      curingType !== original?.curingType ||
      remark !== (original?.remark ?? ''),
    [curingType, remark, original],
  );

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(CuringTypeUrls.list);
    }
  };

  const handleSubmission = async () => {
    if (!validate()) return;
    try {
      await curingTypeService.updateCuringType(parseInt(id), {
        curingType: curingType.trim(),
        remark: remark.trim(),
      });
      toast.success('Curing type updated successfully.');
      navigate(CuringTypeUrls.list);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.[0]?.message ||
        error?.response?.data?.message ||
        'Failed to update curing type.',
      );
    }
  };

  return {
    curingType, setCuringType,
    remark, setRemark,
    error,
    loading,
    handleSubmission,
    handleBack,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    fetchCuringType,
    setError,
    initialError,
  };
};