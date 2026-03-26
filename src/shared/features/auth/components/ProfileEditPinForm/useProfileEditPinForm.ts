import { useUserService } from "@/shared/features/users/services/UserService";
import { useInputValidate } from "@/shared/features/auth/components/InputValidate/useInputValidate";
import { useState } from "react";

const useProfileEditPinForm = (onClose: () => void) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const { error, validate } = useInputValidate({ pin, confirmPin });
  const userService = useUserService();

  const handleOnSave = async () => {
    if (validate()) {
      await userService.updateProfilePin(pin);
      onClose(); // ✅ dialog close pannuvaen
    }
  };

  return { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave };
};

export { useProfileEditPinForm };