import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { ContactInputFields } from "../ContactInputFields/ContactInputFields";
import { useContactEditForm } from "./useContactEditForm";
import type { ContactEditFormProps } from "./DTOs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"; 

const ContactEditForm = (props: ContactEditFormProps) => {
  const { contactType, contactItems, input, setInput, error, model, handleUpdate } = useContactEditForm(props);
  

  return (
    <div className="flex flex-col gap-4 ">
      <Select value={props.selectedItem.type} disabled={true}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {contactItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Input Fields */}
      <ContactInputFields
        contactType={contactType}
        input={input}
        setInput={setInput}
        error={error}
      />

      {/* Buttons */}
      <FormSubmissionButtons
        label="Update"
        onCancel={() => model.close()}
        onSave={handleUpdate}
      />

    </div>
  );
};

export { ContactEditForm };