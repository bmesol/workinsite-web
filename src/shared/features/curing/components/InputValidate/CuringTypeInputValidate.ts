import { useState } from 'react';

interface CuringTypeInputProps {
  curingType: string;
  remark: string;
}

export const useCuringTypeInputValidate = (props: CuringTypeInputProps) => {
  const { curingType } = props;

  const initialError = {
    curingType: '',
    remark: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof initialError, message: string) => {
      setError(prev => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!curingType.trim())
      updateError('curingType', 'Please enter a curing type');

    return isValid;
  };

  return { error, validate, setError, initialError };
};