import { useEffect, useState } from "react";
import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useRoleService } from "../../services/RoleService";

const useUserCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");

  const [name, setName] = useState(queryString.get("name") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [roleList, setRoleList] = useState<{ label: string; value: string }[]>([]);

  const { error, validate } = useInputValidate({ name, phoneNumber, role });
  const roleService = useRoleService();
  const userDetail = { name, phone: phoneNumber, roleId: Number(role) };

 useEffect(() => {
  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles({ ignorePagination: true });
      const rolesData = data?.items || data || [];
      const formatted = rolesData.map((item: any) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setRoleList(formatted);
    } catch (err) {
      console.error("UserCreation: failed to fetch roles", err);
      setRoleList([]);
    }
  };
  fetchRoles();
}, []);

  const handleOnCancel = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(UsersUrls.list);
  };

  return {
    name, setName,
    phoneNumber, setPhoneNumber,
    role, setRole,
    error, validate,
    userDetail,
    roles: roleList,
    handleOnCancel,
  };
};

export { useUserCreation };