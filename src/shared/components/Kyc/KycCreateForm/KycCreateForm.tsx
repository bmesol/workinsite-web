import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycInputFields } from "../KycInputFields/KycInputFields";
import { useKycCreateForm } from "./useKycCreateForm";
import { KYCTypes, type KycTypesProps } from "../DTOs/DTOs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const KycCreateForm = (props: KycTypesProps) => {
  const { kycType, kycItems, input, setInput, error, handleSelectChange, handleAdd } = useKycCreateForm(props);

  return (
    <div className="flex flex-col gap-4">
      <FormInput errorMessage={error.select}>
        <Select onValueChange={handleSelectChange} value={kycType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select KYC type..." />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4} className="z-[9999] bg-white">
            {kycItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormInput>

      <KycInputFields kycType={kycType as KYCTypes} input={input} setInput={setInput} error={error} />

      <FormSubmissionButtons label="Add" onCancel={() => props.onClose?.()} onSave={handleAdd} />
    </div>
  );
};

export { KycCreateForm };