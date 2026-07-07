import { Button } from "@/shared/components/ui/button";
import { PinField } from "../FormFields/PinField";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

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
  const { t } = useLanguage();
  const { pin, setPin, confirmPin, setConfirmPin, error, onSave } = props;

  return (
    <div className="flex flex-col gap-4 ">
      <PinField
        label={t('New Pin')}
        inputValue={pin}
        setInputValue={setPin}
        errorMessage={error.pin}
        required={true}
      />
      <PinField
        label={t('Confirm Pin')}
        inputValue={confirmPin}
        setInputValue={setConfirmPin}
        errorMessage={error.confirmPin}
        required={true}
      />
      <Button
        variant="default"
        className="w-full h-11 cursor-pointer"
        onClick={onSave}
      >
        {t('Save')}
      </Button>
    </div>
  );
};

export { PinForm };