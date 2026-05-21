import { useState } from 'react';

interface InputValidateProps {
  name?: string;
  multiplier?: string;
}

export const useShiftInputValidate = (props: InputValidateProps) => {
  const { name, multiplier } = props;
  const initialError = { name: '', multiplier: '' };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const normalizedName = name ? name.replace(/\s+/g, ' ').trim() : '';

    if (!normalizedName) {
      setError(prev => ({ ...prev, name: 'Shift is required' }));
      isValid = false;
    } else if (normalizedName.length < 2) {
      setError(prev => ({ ...prev, name: 'Invalid name' }));
      isValid = false;
    } else {
      const nameRegex = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;
      if (!nameRegex.test(normalizedName)) {
        setError(prev => ({ ...prev, name: 'Invalid name' }));
        isValid = false;
      }
    }

    if (!multiplier || multiplier.trim().length === 0) {
      setError(prev => ({ ...prev, multiplier: 'Multiplier is required' }));
      isValid = false;
    } else {
      const trimmedMultiplier = multiplier.trim();
      const multiplierRegex = /^\d+(\.\d{1,2})?$/;
      if (!multiplierRegex.test(trimmedMultiplier)) {
        setError(prev => ({
          ...prev,
          multiplier: 'Enter a valid number (max 2 decimals)',
        }));
        isValid = false;
      } else {
        const num = parseFloat(trimmedMultiplier);
        if (num <= 0) {
          setError(prev => ({
            ...prev,
            multiplier: 'Multiplier must be greater than 0',
          }));
          isValid = false;
        }
      }
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};