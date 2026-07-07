import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { UpiInputFields } from "../UpiInputFields/UpiInputField";
import { useUpiEditForm } from "./useUpiEditForm";
import type { UpiEditFormProps } from "../DTOs/DTOs";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const UpiEditForm = (props: UpiEditFormProps) => {
  const { t } = useLanguage();
  const { upiType, upiItems, input, setInput, error, handleUpdate } = useUpiEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <Select value={props.selectedItem.type} disabled>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {upiItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <UpiInputFields upiType={upiType} input={input} setInput={setInput} error={error} />
      <FormSubmissionButtons label={t('Update')} onCancel={() => props.onClose?.()} onSave={handleUpdate} />
    </div>
  );
};

export { UpiEditForm };