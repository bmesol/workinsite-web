import { useInputValidate } from "../InputValidate/InputValidate";
import { useUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useState } from "react";

const useUserEditPinForm = (userId: string, onClose: () => void) => {  // 👈 accept onClose
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  

  const { error, validate } = useInputValidate({ pin, confirmPin });
  const userService = useUserService();
  const navigate = useNavigate();

  const handleOnSave = async () => {
    if (validate()) {
      onClose();                                               // 👈 call it here
      await userService.updatePin(parseInt(userId), pin);
      navigate(UsersUrls.list);
    }
  };

  return { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave };
};

export { useUserEditPinForm };