import { BankAccountForm } from "../BankAccountForm/BankAccountForm";
import type { BankAccountEditFormProps } from "../DTOs/DTOs";

const BankAccountEditForm = (props: BankAccountEditFormProps) => (
  <BankAccountForm {...props} mode="edit" />
);

export { BankAccountEditForm };
