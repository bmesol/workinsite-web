import type { InputValidateProps } from "./DTOs";
import { useState } from "react";

const useInputValidate = (props: InputValidateProps) => {
  const { name, contactId } = props;

  const initialError = { name: "", contact: "" };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!name) updateError("name", "Please enter name");
    if (name && (name.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name as string))) updateError("name", "Invalid name");

    if (!contactId) updateError("contact", "Please select contact");

    return isValid;
  };

  return { error, validate };
};

export { useInputValidate };