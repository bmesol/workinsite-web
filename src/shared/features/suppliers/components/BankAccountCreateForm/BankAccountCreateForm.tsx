import { PhoneNumberField as AccountNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { IfscCodeField } from "@/shared/components/FormFields/IfscCodeFiled";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { useBankAccountCreateForm } from "./useBankAccountCreateForm";
import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";

type BankAccountCreateFormProps = SupplierDetailsType & { onClose: () => void }; 

const BankAccountCreateForm = (props: BankAccountCreateFormProps) => {
  const {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    ifscCode,
    setIfscCode,
    error,
    handleAdd,
  } = useBankAccountCreateForm(props);

  return (
    <div className="flex flex-col gap-4">
      <FormInput errorMessage={error.accountName}>
        <NameField inputValue={accountName} setInputValue={setAccountName} placeholder="Account name" isHideLabel={true} />
      </FormInput>
      <FormInput errorMessage={error.accountNumber}>
        <AccountNumberField inputValue={accountNumber} setInputValue={setAccountNumber} length={18} placeholder="Account number" isHideLabel={true} />
      </FormInput>
      <FormInput errorMessage={error.ifscCode}>
        <IfscCodeField inputValue={ifscCode} setInputValue={setIfscCode} />
      </FormInput>
      <FormSubmissionButtons label="Add" onCancel={props.onClose} onSave={handleAdd} />
    </div>
  );
};

export { BankAccountCreateForm };