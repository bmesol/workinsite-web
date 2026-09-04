import type { SiteInputValidateProps } from "./DTOs";
import { useState } from "react";

const useSiteInputValidate = (props: SiteInputValidateProps) => {
  const { name, clientId, googleLocation, contactId, wageTypeId } = props; 

  const initialError = {
    name: "",
    client: "",
    googleLocation: "",
    contact: "",
    supervisor: "",
    wageType: "", 
  };
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
    if (name && (name.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name))) updateError("name", "Invalid name");
    if (!clientId) updateError("client", "Please select client");
    if (!googleLocation) updateError("googleLocation", "Please enter google location");
    if (!contactId) updateError("contact", "Please select contact");
    if (!wageTypeId) updateError("wageType", "Please select a wage type");
    return isValid;
  };

  return { error, validate };
};

export { useSiteInputValidate };