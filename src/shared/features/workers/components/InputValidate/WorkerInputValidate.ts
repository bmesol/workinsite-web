import { GenderTypes } from "../../DTOs/WorkerProps";
import type { WorkerInputValidateProps } from "./DTOs";
import { useState } from "react";

const useWorkerInputValidate = (props: WorkerInputValidateProps) => {
  const { name, dateOfBirth, workerCategoryId, contactId, gender } = props;

  const genderItems = [{ label: "Male", value: GenderTypes.MALE }, { label: "Female", value: GenderTypes.FEMALE }];

  const initialError = { name: "", contact: "", workerCategoryId: "", dateOfBirth: "", gender: "" };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

 // ✅ Cleaner: batch all errors in one setError call instead of multiple
const validate = () => {
  const newError = { ...initialError };
  let isValid = true;

  const updateError = (field: keyof typeof initialError, message: string) => {
    newError[field] = message;
    isValid = false;
  };

  if (!name) updateError("name", "Please enter name");
  if (name && (name.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(name))) 
    updateError("name", "Invalid name");
  if (!dateOfBirth) updateError("dateOfBirth", "Please select date of birth");
  if (dateOfBirth && !/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(dateOfBirth)) 
    updateError("dateOfBirth", "Invalid date of birth");
  if (!workerCategoryId) updateError("workerCategoryId", "Please select worker category");
  if (!contactId) updateError("contact", "Please select contact");
  if (!gender) updateError("gender", "Please select gender");

  setError(newError); // 👈 single setState call
  return isValid;
};

  return { genderItems, error, validate };
};

export { useWorkerInputValidate };
