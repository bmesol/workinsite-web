import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { ContactInputFields } from "../ContactInputFields/ContactInputFields";
import { useContactCreateForm } from "./useContactCreateForm";
import type { ContactListType } from "../../DTOs/ContactList";
import { ContactTypes } from "../../DTOs/ContactProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactCreateForm = (props: ContactListType & { onClose?: () => void }) => {
  const { onClose } = props;
  const { t } = useLanguage();
  const { contactType, contactItems, input, setInput, error, handleSelectChange, handleAdd } = useContactCreateForm(props, onClose);

  return (
    <div className="flex flex-col gap-4">
      <FormInput errorMessage={error.select}>
        <Select onValueChange={handleSelectChange} value={contactType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('Contact Type')} />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="z-[9999] bg-white">
            {contactItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormInput>

      <ContactInputFields
        contactType={contactType as ContactTypes}
        input={input}
        setInput={setInput}
        error={error}
      />

     <FormSubmissionButtons
  label={t('Add')}
  onCancel={() => onClose?.()}
  onSave={handleAdd}
/>
    </div>
  );
};

export { ContactCreateForm };
