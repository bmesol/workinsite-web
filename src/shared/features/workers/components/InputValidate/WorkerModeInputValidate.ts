import { useState } from 'react';

interface InputValidateProps {
  name?: string;
}

export const useWorkModeInputValidate = (props: InputValidateProps) => {
  const { name } = props;
  const initialError = { name: '' };
  const [error, setError] = useState(initialError);

  const validate = () => {
    const newError = { ...initialError }; 
    let isValid = true;

    if (!name || name.length === 0) {
      newError.name = 'Work Mode is required';
      isValid = false;
    } else if (
      name.length < 2 ||
      !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name)
    ) {
      newError.name = 'Invalid name';
      isValid = false;
    }

    setError(newError); 
    return isValid;
  };

  return { error, validate, setError, initialError };
};