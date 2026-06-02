import { useState } from "react";

interface InputValidateProps {
  name?: string;
}

export const useUnitInputValidate = (props: InputValidateProps) => {
  const { name } = props;

  const initialError = { name: "" };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    if (!name || name.length === 0) {
      setError((prev) => ({ ...prev, name: "Unit is required" }));
      isValid = false;
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};
