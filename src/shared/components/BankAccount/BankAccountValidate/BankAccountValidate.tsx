import { useState } from "react";

const useBankAccountValidate = (accountName: string, accountNumber: string, ifscCode: string) => {
  const initialError = { accountName: "", accountNumber: "", ifscCode: "" };
  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!accountName) updateError("accountName", "Please enter account name");
    if (accountName && (accountName.length < 2 || !/^[a-zA-Z]+ ?[a-zA-Z]+ ?[a-zA-Z]*$/.test(accountName)))
      updateError("accountName", "Invalid account name");

    if (!accountNumber) updateError("accountNumber", "Please enter account number");
    if (accountNumber && accountNumber.length < 9) updateError("accountNumber", "Invalid account number");

    if (!ifscCode) updateError("ifscCode", "Please enter ifsc code");
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) updateError("ifscCode", "Invalid ifsc code");

    return isValid;
  };

  return { error, validate };
};

export { useBankAccountValidate };
