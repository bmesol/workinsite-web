import { PhoneNumberField as AccountNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { IfscCodeField } from "@/shared/components/FormFields/IfscCodeFiled";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { useBankAccountEditForm } from "./useBankAccountEditForm";
import type { BankAccountEditFormProps } from "./DTOs";

const BankAccountEditForm = (props: BankAccountEditFormProps & { onClose?: () => void }) => {
  const {
    accountName,
    setAccountName,
    accountNumber,
    setAccountNumber,
    ifscCode,
    setIfscCode,
    error,
    handleUpdate,
  } = useBankAccountEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      {/* Account Name */}
      <FormInput errorMessage={error.accountName}>
        <NameField
          inputValue={accountName}
          setInputValue={setAccountName}
          placeholder="Account name"
          isHideLabel={true}
        />
      </FormInput>

      {/* Account Number */}
      <FormInput errorMessage={error.accountNumber}>
        <AccountNumberField
          inputValue={accountNumber}
          setInputValue={setAccountNumber}
          length={18}
          placeholder="Account number"
          isHideLabel={true}
        />
      </FormInput>

      {/* IFSC Code */}
      <FormInput errorMessage={error.ifscCode}>
        <IfscCodeField
          inputValue={ifscCode}
          setInputValue={setIfscCode}
        />
      </FormInput>

      {/* Submit Buttons */}
      <FormSubmissionButtons
        label="Update"
        onCancel={() => props.onClose?.()}
        onSave={handleUpdate}
      />
    </div>
  );
};

export { BankAccountEditForm };