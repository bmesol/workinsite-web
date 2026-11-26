import { useEffect, useState } from "react";
import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { createRoleService } from "../../services/RoleService";
import type { RoleListItem } from "../../services/RoleService";
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";

const useUserCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const redirectUrl = queryString.get("redirect");

  const [name, setName] = useState(queryString.get("name") || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [roleList, setRoleList] = useState<{ label: string; value: string }[]>([]);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate } = useInputValidate({ name, phoneNumber, role });
  const roleService = createRoleService();
  const userDetail = { name, phone: phoneNumber, roleId: Number(role) };

 useEffect(() => {
  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles({ ignorePagination: true });
      const rolesData: RoleListItem[] = data?.items || data || [];
      const formatted = rolesData.map((item) => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setRoleList(formatted);
    } catch {
      setRoleList([]);
    }
  };
  fetchRoles();
}, []);

  const hasUnsavedChanges = () =>
    name.trim() !== '' ||
    phoneNumber !== '' ||
    role !== '';

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const navigateBack = () => {
    if (redirectUrl) {
      navigate(redirectUrl);
      return;
    }
    navigate(UsersUrls.list);
  };

  const handleOnCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
      return;
    }
    navigateBack();
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigateBack();
  };

  return {
    name, setName,
    phoneNumber, setPhoneNumber,
    role, setRole,
    error, validate,
    userDetail,
    roles: roleList,
    handleOnCancel,
    showUnsavedDialog,
    handleKeepEditing,
    handleDiscardChanges,
  };
};

export { useUserCreation };