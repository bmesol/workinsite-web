import type { InputValidateProps } from "./DTOs";
import { useState } from "react";

const useInputValidate = (props: InputValidateProps) => {
  const { name, phoneNumber, role, pin, confirmPin } = props;

  const roles = [ { label: "Engineer", value: "2" }, { label: "Supervisor", value: "3" } ];

  const initialError = { name: "", phoneNumber: "", role: "", pin: "", confirmPin: "" };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (name?.length === 0) updateError("name", "Please enter name");
    if (name?.length && (name?.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name as string))) updateError("name", "Invalid name");

    if (phoneNumber?.length === 0) updateError("phoneNumber", "Please enter phone number");
    if (phoneNumber?.length && phoneNumber?.length !== 10) updateError("phoneNumber", "Phone number must be 10 digits");

    if (role?.length === 0) updateError("role", "Please select role");

    if (pin?.length === 0) updateError("pin", "Please enter pin");
    if (pin?.length && pin?.length !== 4) updateError("pin", "Pin must be 4 digits");

    if (confirmPin?.length === 0) updateError("confirmPin", "Please enter confirm pin");
    if (confirmPin?.length && confirmPin?.length !== 4) updateError("confirmPin", "Confirm pin must be 4 digits");

    if (pin?.length === 4 && confirmPin?.length === 4 && pin !== confirmPin) updateError("confirmPin", "Confirmation PIN mis matching");

    return isValid;
  };

  return { roles, error, validate };
};

export { useInputValidate };