import { useBankAccountValidate } from "../BankAccountValidate/BankAccountValidate";
import type { BankAccountTypesProps } from "../DTOs/DTOs";
import { useState } from "react";

const useBankAccountCreateForm = (props: BankAccountTypesProps) => {
  const { details, setDetails, onClose } = props;

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const { error, validate } = useBankAccountValidate(accountName, accountNumber, ifscCode);

  const handleAdd = () => {
    if (validate()) {
      setDetails({
        bankAccounts: [...(details.bankAccounts ?? []), { accountName, accountNumber, ifscCode }],
      });
      onClose?.();
    }
  };

  return { accountName, setAccountName, accountNumber, setAccountNumber, ifscCode, setIfscCode, error, handleAdd };
};

export { useBankAccountCreateForm };