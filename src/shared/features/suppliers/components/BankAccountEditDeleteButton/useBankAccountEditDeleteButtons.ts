import type { BankAccountEditDeleteButtonsProp } from "./DTOs";

const useBankAccountEditDeleteButtons = (props: BankAccountEditDeleteButtonsProp) => {
  const { supplierDetails, setSupplierDetails } = props;

  const handleDelete = (id: number) => {
    const filteredBankAccounts = supplierDetails.bankAccounts.filter((_, index) => index !== id);
    setSupplierDetails((prev) => ({...prev, bankAccounts: filteredBankAccounts}));
  };

  return { handleDelete };
};

export { useBankAccountEditDeleteButtons };
