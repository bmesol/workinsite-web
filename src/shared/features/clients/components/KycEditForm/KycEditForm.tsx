import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { KycInputFields } from "../KycInputFields/KycInputFields";
import { useKycEditForm } from "./useKycEditForm";
import type { ClientEditFormProps } from "./DTOs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface KycEditFormProps extends ClientEditFormProps {
  onClose: () => void;
}

const KycEditForm = (props: KycEditFormProps) => {
  const { onClose } = props;
  const { kycType, kycItems, input, setInput, error, handleUpdate } = useKycEditForm(props, onClose);

  return (
    <div className="flex flex-col gap-4">
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

      <KycInputFields
        kycType={kycType}
        input={input}
        setInput={setInput}
        error={error}
      />

      <FormSubmissionButtons
        label="Update"
        onCancel={onClose}
        onSave={handleUpdate}
      />
    </div>
  );
};

export { KycEditForm };