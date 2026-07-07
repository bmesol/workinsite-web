import { PhoneNumberField as AccountNumberField } from "@/shared/components/FormFields/PhoneNumberField";
import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { IfscCodeField } from "@/shared/components/FormFields/IfscCodeFiled";
import { NameField } from "@/shared/components/FormFields/NameField";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { useBankAccountEditForm } from "./useBankAccountEditForm";
import type { BankAccountEditFormProps } from "../DTOs/DTOs";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const BankAccountEditForm = (props: BankAccountEditFormProps) => {
  const { t } = useLanguage();
  const { accountName, setAccountName, accountNumber, setAccountNumber, ifscCode, setIfscCode, error, handleUpdate } = useBankAccountEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <FormInput errorMessage={error.accountName}>
        <NameField inputValue={accountName} setInputValue={setAccountName} placeholder={t('Account name')} isHideLabel={true} />
      </FormInput>
      <FormInput errorMessage={error.accountNumber}>
        <AccountNumberField inputValue={accountNumber} setInputValue={setAccountNumber} length={18} placeholder={t('Account number')} isHideLabel={true} />
      </FormInput>
      <FormInput errorMessage={error.ifscCode}>
        <IfscCodeField inputValue={ifscCode} setInputValue={setIfscCode} />
      </FormInput>
      <FormSubmissionButtons label={t('Update')} onCancel={() => props.onClose?.()} onSave={handleUpdate} />
    </div>
  );
};

export { BankAccountEditForm };