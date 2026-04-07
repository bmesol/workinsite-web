import { useState } from "react";

const useInputValidate = (props: { name: string; phone?: string }) => {
  const { name, phone } = props;

  const [error, setError] = useState({ name: "", phone: "" });

  const validate = () => {
    const newError = { name: "", phone: "" };
    let isValid = true;

    // name validation
    if (name.length === 0) {
      newError.name = "Please enter name";
      isValid = false;
    } else if (name.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name)) {
      newError.name = "Invalid name";
      isValid = false;
    }

    // phone validation
    if (phone !== undefined) {
      if (phone.length === 0) {
        newError.phone = "Please enter phone";
        isValid = false;
      } else if (!/^[0-9]{10}$/.test(phone)) {
  newError.phone = "Invalid phone number ";
  isValid = false;
}
    }

    // ✅ set all errors in one call — no race condition
    setError(newError);
    return isValid;
  };

  return { error, validate };
};

export { useInputValidate };