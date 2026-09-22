import { BankAccountForm } from "../BankAccountForm/BankAccountForm";
import type { BankAccountTypesProps } from "../DTOs/DTOs";

const BankAccountCreateForm = (props: BankAccountTypesProps) => (
  <BankAccountForm {...props} mode="create" />
);

export { BankAccountCreateForm };
