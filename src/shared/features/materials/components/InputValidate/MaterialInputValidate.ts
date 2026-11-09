import {useState} from 'react';

interface MaterialError {
  name: string;
  unitId: string;
}

interface MaterialInputProps {
  name: string;
  unitId: string | number;
}

export const useMaterialInputValidate = ({name, unitId}: MaterialInputProps) => {
  const initialError: MaterialError = {
    name: '',
    unitId: '',
  };

  const [error, setError] = useState<MaterialError>(initialError);

  const validate = () => {
    const errors: MaterialError = {
      name: name.trim() ? '' : 'Material name is required',
      unitId: unitId ? '' : 'Unit is required',
    };
    setError(errors);
    return !Object.values(errors).some(e => e !== '');
  };

  return {error, validate, setError, initialError};
};