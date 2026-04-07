import { ContactTypes } from "../../DTOs/ContactProps";
import { useState } from "react";

const useContactValidate = (input: string, contactType: ContactTypes) => {
  const initialError = { phone: "", email: "", address: "", select: "" };
  const [error, setError] = useState(initialError);

  const contactItems = [{ label: "Phone", value: ContactTypes.PHONE }, { label: "Email", value: ContactTypes.EMAIL }, { label: "Address", value: ContactTypes.ADDRESS }];

  const validate = () => {
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    switch (contactType) {
      case ContactTypes.PHONE:
        if (!input) updateError("phone", "Please enter phone");
        else if (input.length < 10) updateError("phone", "Phone must be 10 digits");
        break;

      case ContactTypes.EMAIL:
        if (!input) updateError("email", "Please enter email");
        else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(input)) updateError("email", "Invalid email");
        break;

      case ContactTypes.ADDRESS:
        if (!input) updateError("address", "Please enter address");
        break;

      default:
        setError((prev) => ({ ...prev, select: "Select contact type" }));
        isValid = false;
        break;
    }

    return isValid;
  };

  return { error, setError, initialError, validate, contactItems };
};

export { useContactValidate };