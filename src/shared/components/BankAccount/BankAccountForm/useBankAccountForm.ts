import { useState } from "react";
import { useBankAccountValidate } from "../BankAccountValidate/BankAccountValidate";
import type { BankAccountTypesProps } from "../DTOs/DTOs";

interface BankAccountFormProps extends BankAccountTypesProps {
  mode: "create" | "edit";
  selectedItem?: { id: number; accountName: string; accountNumber: string; ifscCode: string };
}

const useBankAccountForm = (props: BankAccountFormProps) => {
  const { details, setDetails, onClose, mode, selectedItem } = props;

  const [accountName, setAccountName] = useState(
    mode === "edit" ? selectedItem!.accountName : ""
  );
  const [accountNumber, setAccountNumber] = useState(
    mode === "edit" ? selectedItem!.accountNumber : ""
  );
  const [ifscCode, setIfscCode] = useState(
    mode === "edit" ? selectedItem!.ifscCode : ""
  );

  const { error, validate } = useBankAccountValidate(accountName, accountNumber, ifscCode);

  const handleSave = () => {
    if (!validate()) return;

    if (mode === "create") {
      setDetails({
        bankAccounts: [...(details.bankAccounts ?? []), { accountName, accountNumber, ifscCode }],
      });
    } else {
      const updated = details.bankAccounts.map((item, index) =>
        index === selectedItem!.id ? { accountName, accountNumber, ifscCode } : item
      );
      setDetails({ bankAccounts: [...updated] });
    }

    onClose?.();
  };

  return {
    accountName, setAccountName,
    accountNumber, setAccountNumber,
    ifscCode, setIfscCode,
    error, handleSave,
  };
};

export { useBankAccountForm };
export type { BankAccountFormProps };
