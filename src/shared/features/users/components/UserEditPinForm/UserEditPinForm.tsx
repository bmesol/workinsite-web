import { PinForm } from "@/shared/components/PinForm/PinForm";
import { useUserEditPinForm } from "./useUserEditPinForm";

const UserEditPinForm = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave } = 
    useUserEditPinForm(userId, onClose);

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

export { UserEditPinForm };