import { useListItemDelete } from "@/shared/hooks/useListItemDelete";
import type { BankAccountEditDeleteButtonsProp } from "../DTOs/DTOs";

const useBankAccountEditDeleteButtons = (props: BankAccountEditDeleteButtonsProp) => {
  const { details, setDetails } = props;
  const { handleDelete } = useListItemDelete(
    details.bankAccounts,
    (filtered) => setDetails({ bankAccounts: filtered })
  );
  return { handleDelete };
};

export { useBankAccountEditDeleteButtons };
