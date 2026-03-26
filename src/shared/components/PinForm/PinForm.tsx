import { FormSubmissionButtons } from "@/shared/components/FormFields/FormSubmissionButton";
import { PinField } from "../FormFields/PinField";

interface PinFormProps {
  pin: string;
  setPin: (val: string) => void;
  confirmPin: string;
  setConfirmPin: (val: string) => void;
  error: { pin: string; confirmPin: string };
  onSave: () => void;
  onCancel: () => void;
}

const PinForm = (props: PinFormProps) => {
  const { pin, setPin, confirmPin, setConfirmPin, error, onSave, onCancel } = props;

  return (
    <div className="flex flex-col gap-4">
      <PinField
        label="New Pin"
        inputValue={pin}
        setInputValue={setPin}
        errorMessage={error.pin}
        required={true}
      />
      <PinField
        label="Confirm Pin"
        inputValue={confirmPin}
        setInputValue={setConfirmPin}
        errorMessage={error.confirmPin}
        required={true}
      />
      <FormSubmissionButtons
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export { PinForm };