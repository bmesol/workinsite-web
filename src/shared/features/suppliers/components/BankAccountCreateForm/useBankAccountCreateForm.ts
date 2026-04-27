import { useBankAccountValidate } from "../BankAccountValidate/BankAccountValidate";
import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { useState } from "react";

const useBankAccountCreateForm = (props: SupplierDetailsType & { onClose: () => void }) => { 
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  const { error, validate } = useBankAccountValidate(accountName, accountNumber, ifscCode);

  const handleAdd = () => {
    if (validate()) {
      props.setSupplierDetails((prev) => ({
        ...prev,
        bankAccounts: [...(prev.bankAccounts ?? []), { accountName, accountNumber, ifscCode }],
      }));
      props.onClose(); 
    }
  };

  return { accountName, setAccountName, accountNumber, setAccountNumber, ifscCode, setIfscCode, error, handleAdd };
};

export { useBankAccountCreateForm };