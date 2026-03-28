import type { InputValidateProps } from "./DTOs";
import { useState } from "react";

const useInputValidate = (props: InputValidateProps) => {
  const { name, phoneNumber, pin, confirmPin } = props;

  const initialError = {
    name: "",
    phoneNumber: "",
    pin: "",
    confirmPin: "",
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (
      field: keyof typeof initialError,
      message: string
    ) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

   // Name validation
if (name !== undefined) {
  const trimmedName = name.trim().replace(/\s+/g, " "); 
  if (trimmedName.length === 0) 
    updateError("name", "Please enter name");
  else if (trimmedName.length < 2) 
    updateError("name", "Invalid name");
  else if (!/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(trimmedName)) 
    updateError("name", "Invalid name");
}

    if (phoneNumber !== undefined) { 
      if (!phoneNumber || phoneNumber.length === 0)
        updateError("phoneNumber", "Please enter phone number");
      else if (phoneNumber.length !== 10)
        updateError("phoneNumber", "Phone number must be 10 digits");
    }

    if (pin !== undefined) {
      if (pin.length === 0) updateError("pin", "Please enter pin");
      else if (pin.length !== 4) updateError("pin", "Pin must be 4 digits");
    }

    if (confirmPin !== undefined) {
      if (confirmPin.length === 0)
        updateError("confirmPin", "Please enter confirm pin");
      else if (confirmPin.length !== 4)
        updateError("confirmPin", "Confirm pin must be 4 digits");
      else if (pin !== confirmPin)
        updateError("confirmPin", "Confirmation PIN mismatching");
    }

    return isValid;
  };

  return { error, validate };
};

export { useInputValidate };