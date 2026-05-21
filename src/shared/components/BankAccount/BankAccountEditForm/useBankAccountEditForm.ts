import { useBankAccountValidate } from "../BankAccountValidate/BankAccountValidate";
import type { BankAccountEditFormProps } from "../DTOs/DTOs";
import { useState } from "react";

const useBankAccountEditForm = (props: BankAccountEditFormProps) => {
  const { details, setDetails, selectedItem, onClose } = props;

  const [accountName, setAccountName] = useState(selectedItem.accountName);
  const [accountNumber, setAccountNumber] = useState(selectedItem.accountNumber);
  const [ifscCode, setIfscCode] = useState(selectedItem.ifscCode);
  const { error, validate } = useBankAccountValidate(accountName, accountNumber, ifscCode);

  const handleUpdate = () => {
    if (validate()) {
      const updatedBankAccounts = details.bankAccounts.map((item, index) =>
        index === selectedItem.id ? { accountName, accountNumber, ifscCode } : item
      );
      setDetails({ bankAccounts: [...updatedBankAccounts] });
      onClose?.();
    }
  };

  return { accountName, setAccountName, accountNumber, setAccountNumber, ifscCode, setIfscCode, error, handleUpdate };
};

export { useBankAccountEditForm };