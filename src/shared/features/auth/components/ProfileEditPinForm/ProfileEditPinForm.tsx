import { PinForm } from "@/shared/components/PinForm/PinForm";
import { useProfileEditPinForm } from "./useProfileEditPinForm";

const ProfileEditPinForm = ({ onClose }: { onClose: () => void }) => {
  const { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave } =
    useProfileEditPinForm(onClose);

  return (
    <PinForm
      pin={pin}
      setPin={setPin}
      confirmPin={confirmPin}
      setConfirmPin={setConfirmPin}
      error={error}
      onSave={handleOnSave}
      onCancel={onClose}
    />
  );
};

export { ProfileEditPinForm };