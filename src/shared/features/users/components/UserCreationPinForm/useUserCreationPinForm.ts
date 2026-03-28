import { useInputValidate } from "../InputValidate/InputValidate";
import { useUserService } from "../../services/UserService";
import type { UserBase } from "../../DTOs/UserBase";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useState } from "react";
import { toast } from "sonner";

const useUserCreationPinForm = (userDetail: UserBase, onClose: () => void, queryString?: URLSearchParams) => {
  const userService = useUserService();
  const navigate = useNavigate();

  const redirectUrl = queryString?.get("redirect") || "";
  const redirectUrlParams = new URLSearchParams(redirectUrl);
  const supervisorIds = redirectUrlParams.get("supervisorIds") || "[]";

  let paramsArray = redirectUrl?.split("&");
  paramsArray = paramsArray?.filter((param) => !param.startsWith("supervisorIds="));
  const updatedRedirectUrl = paramsArray?.join("&");

  const { name, phone, roleId } = userDetail;  // ✅ roleId is number from UserBase
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const { error, validate } = useInputValidate({ pin, confirmPin });

  const handleOnSave = async () => {
    if (validate()) {
      onClose(); 
      try {
        const response = await userService.createUser({ 
          name, 
          phone, 
          roleId,        
          password: pin, 
          language: "en" 
        });
        if (redirectUrl) {
          const parsedSupervisorIds = JSON.parse(supervisorIds);
          parsedSupervisorIds.push(response.id);
          navigate(`${updatedRedirectUrl}&supervisorIds=[${parsedSupervisorIds.toString()}]`);
          return;
        }
        navigate(UsersUrls.list);
      } catch (error: any) {
        error.response.data.forEach((i: any) =>
          toast.error(i.message, { description: "Invalid Request" }) // ✅ replaces useToast
        );
      }
    }
  };

  return { pin, setPin, confirmPin, setConfirmPin, error, handleOnSave };
};

export { useUserCreationPinForm };