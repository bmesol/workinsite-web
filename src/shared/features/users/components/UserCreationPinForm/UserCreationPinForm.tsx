import { PinForm } from "@/shared/components/PinForm/PinForm";
import { useUserCreationPinForm } from "./useUserCreationPinForm";
import type { UserBase } from "../../DTOs/UserBase";

const UserCreationPinForm = (props: {
  queryString?: URLSearchParams;
  userDetail: UserBase;
  onClose: () => void; // 👈 add this
}) => {
  const { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave } =
    useUserCreationPinForm(props.userDetail, props.onClose, props.queryString); 
  return (
    // UserCreationPinForm.tsx
<PinForm 
  pin={pin} 
  setPin={setPin} 
  confirmPin={confirmPin} 
  setConfirmPin={setConfirmPin} 
  error={error} 
  onSave={handleOnSave} 
  onCancel={props.onClose}  // 👈 add this — onCancel closes the modal
/>
  );
};

export { UserCreationPinForm };