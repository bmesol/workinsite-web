import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCuringTypeService } from '../../service/CuringTypeService';
import { useCuringTypeInputValidate } from '../../components/InputValidate/CuringTypeInputValidate';
import { CuringTypeUrls } from '../../utils/urls';
import { parseApiError } from '@/shared/utils/parseApiError';

export const useCuringTypeCreate = () => {
  const navigate = useNavigate();
  const curingTypeService = useCuringTypeService();

  const [curingType, setCuringType] = useState('');
  const [remark, setRemark] = useState('');

  const { error, validate, setError, initialError } =
    useCuringTypeInputValidate({ curingType, remark });

  const resetForm = () => {
    setCuringType('');
    setRemark('');
    setError(initialError);
  };

  const handleBack = () => navigate(CuringTypeUrls.list);

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
    handleBack,
    resetForm,
  };
};