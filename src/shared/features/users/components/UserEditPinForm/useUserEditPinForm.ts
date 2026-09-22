import { useInputValidate } from "../InputValidate/InputValidate";
import { createUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useState } from "react";

const useUserEditPinForm = (userId: string, onClose: () => void) => {  // 👈 accept onClose
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  

  const { error, validate } = useInputValidate({ pin, confirmPin });
  const userService = createUserService();
  const navigate = useNavigate();

  const handleOnSave = async () => {
    if (validate()) {
      onClose();                                              
      await userService.updatePin(parseInt(userId), pin);
      navigate(UsersUrls.list);
    }
  };

  return { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave };
};

export { useUserEditPinForm };