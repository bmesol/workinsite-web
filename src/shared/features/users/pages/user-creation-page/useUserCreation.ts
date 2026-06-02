import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useState } from "react";

const useUserCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");

  const [name, setName] = useState(queryString.get("name") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const { roles, error, validate } = useInputValidate({ name, phoneNumber, role });
  const userDetail = { name, phone: phoneNumber, roleId: Number(role) };

  const handleOnCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(UsersUrls.list);
  };

  return { name, setName, phoneNumber, setPhoneNumber, role, setRole, error, validate, userDetail, roles, handleOnCancel };
};

export { useUserCreation };