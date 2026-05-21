import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { UpiInputFields } from "../UpiInputFields/UpiInputField";
import { useUpiCreateForm } from "./useUpiCreateForm";
import { UpiTypes, type UpiTypesProps } from "../DTOs/DTOs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const UpiCreateForm = (props: UpiTypesProps) => {
  const { upiType, upiItems, input, setInput, error, handleSelectChange, handleAdd } = useUpiCreateForm(props);

  return (
    <div className="flex flex-col gap-4">
      <FormInput errorMessage={error.select}>
        <Select onValueChange={(value) => handleSelectChange(value as UpiTypes)} value={upiType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select UPI Type..." />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="z-[9999] bg-white">
            {upiItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormInput>
      <UpiInputFields upiType={upiType as UpiTypes} input={input} setInput={setInput} error={error} />
      <FormSubmissionButtons label="Add" onCancel={() => props.onClose?.()} onSave={handleAdd} />
    </div>
  );
};

export { UpiCreateForm };