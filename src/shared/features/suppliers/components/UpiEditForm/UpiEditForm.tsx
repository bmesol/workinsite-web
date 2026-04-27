import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { UpiInputFields } from "../UpiInputFields/UpiInputField";
import { useUpiEditForm } from "./useUpiEditForm";
import type { UpiEditFormProps } from "./DTOs";

type UpiEditFormPropsWithClose = UpiEditFormProps & { onClose: () => void }; 
const UpiEditForm = (props: UpiEditFormPropsWithClose) => {
  const { upiType, upiItems, input, setInput, error, handleUpdate } = useUpiEditForm(props);

  return (
    <div className="flex flex-col gap-4">
      <Select value={props.selectedItem.type} disabled>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {upiItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <UpiInputFields upiType={upiType} input={input} setInput={setInput} error={error} />
      <FormSubmissionButtons label="Update" onCancel={props.onClose} onSave={handleUpdate} /> 
    </div>
  );
};

export { UpiEditForm };