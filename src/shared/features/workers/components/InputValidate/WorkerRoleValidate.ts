import { useState } from "react";  
const useWorkerRoleInputValidate = (
  name: string,
  salaryPerShift: string,
  hoursPerShift: string,
) => {
  const initialError = {
    name: "",
    salaryPerShift: "",
    hoursPerShift: "",
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

    // Name validation
    if (!name) updateError("name", "Please enter worker role");
    else if (name.length < 2)
      updateError("name", "Worker role must be at least 2 characters");

    // Salary validation
    if (!salaryPerShift) {
      updateError("salaryPerShift", "Please enter salary per shift");
    } else if (isNaN(Number(salaryPerShift))) {
      updateError("salaryPerShift", "Salary must be a valid number");
    } else if (salaryPerShift.startsWith("0") || salaryPerShift === "0") {
      updateError("salaryPerShift", "Salary cannot start with 0");
    }

    // Hours validation
    if (!hoursPerShift) {
      updateError("hoursPerShift", "Please enter hours per shift");
    } else if (isNaN(Number(hoursPerShift))) {
      updateError("hoursPerShift", "Hours must be a valid number");
    } else if (hoursPerShift.startsWith("0") || hoursPerShift === "0") {
      updateError("hoursPerShift", "Hours cannot start with 0");
    } else if (Number(hoursPerShift) > 24) {
      updateError("hoursPerShift", "Hours must not exceed 24");
    }

    return isValid;
  };

  return { error, validate, initialError, setError };
};

export { useWorkerRoleInputValidate };