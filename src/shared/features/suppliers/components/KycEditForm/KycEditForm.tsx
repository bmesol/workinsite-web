import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { KycInputFields } from "../../../clients/components/KycInputFields/KycInputFields";
import { useKycEditForm } from "./useKycEditForm";
import type { KycEditFormProps } from "./DTOs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface KycEditFormPropsWithClose extends KycEditFormProps {
  onClose: () => void;
}

const KycEditForm = (props: KycEditFormPropsWithClose) => {
  const { onClose } = props;
  const { kycType, kycItems, input, setInput, error, handleUpdate } = useKycEditForm(props, onClose);

  return (
    <div className="flex flex-col gap-4">
      {/* KYC Type — Disabled Select */}
      <Select value={props.selectedItem.type} disabled>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {kycItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* KYC Input Fields */}
      <KycInputFields
        kycType={kycType}
        input={input}
        setInput={setInput}
        error={error}
      />

      {/* Submit Buttons */}
      <FormSubmissionButtons
        label="Update"
        onCancel={onClose}
        onSave={handleUpdate}
      />
    </div>
  );
};

export { KycEditForm };