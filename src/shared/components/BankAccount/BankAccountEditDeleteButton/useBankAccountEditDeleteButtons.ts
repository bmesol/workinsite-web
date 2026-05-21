import type { BankAccountEditDeleteButtonsProp } from "../DTOs/DTOs";

const useBankAccountEditDeleteButtons = (props: BankAccountEditDeleteButtonsProp) => {
  const { details, setDetails } = props;

  const handleDelete = (id: number) => {
    const filteredBankAccounts = details.bankAccounts.filter((_, index) => index !== id);
    setDetails({ bankAccounts: filteredBankAccounts });
  };

  return { handleDelete };
};

export { useBankAccountEditDeleteButtons };