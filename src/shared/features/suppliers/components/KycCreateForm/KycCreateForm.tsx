import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { FormInput } from "@/shared/components/FormInput/FormInput";
import { KycInputFields } from "../../../clients/components/KycInputFields/KycInputFields";
import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { useKycCreateForm } from "./useKycCreateForm";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type KycCreateFormProps = SupplierDetailsType & { onClose: () => void }; 

const KycCreateForm = (props: KycCreateFormProps) => {
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

      <KycInputFields
        kycType={kycType as KYCTypes}
        input={input}
        setInput={setInput}
        error={error}
      />

      <FormSubmissionButtons
        label="Add"
        onCancel={props.onClose}
        onSave={handleAdd}
      />
    </div>
  );
};

export { KycCreateForm };