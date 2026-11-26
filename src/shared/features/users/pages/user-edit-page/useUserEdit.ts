import { useInputValidate } from "@/shared/features/users/components/InputValidate/InputValidate";
import { createUserService } from "../../services/UserService";
import { createRoleService } from "../../services/RoleService";
import type { RoleListItem } from "../../services/RoleService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import { useUnsavedChangesGuard } from "@/shared/hooks/useUnsavedChangesGuard";
import type { User } from "@/shared/features/users/DTOs/User";
import { toast } from "sonner";

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useUserEdit = (id: string) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [roleList, setRoleList] = useState<{ label: string; value: string }[]>([]);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [initialData, setInitialData] = useState<{ name: string; phoneNumber: string; role: string; notes: string; isActive: boolean } | null>(null);

  const { error, validate } = useInputValidate({ name, phoneNumber, role });
  const navigate = useNavigate();
  const userService = createUserService();
  const roleService = createRoleService();

  // ── Fetch user and roles on mount ──

  const fetchUser = async () => {
    setLoading(true);
    try {
      const [userData, rolesData] = await Promise.all([
        userService.getUser(parseInt(id, 10)),
        roleService.getRoles({ ignorePagination: true }),
      ]);

      setUser(userData);
      setName(userData.name);
      setPhoneNumber(userData.phone);
      setNotes(userData.note ?? "");
      setIsActive(userData.isActive);

      const rawItems: RoleListItem[] = Array.isArray(rolesData?.items) ? rolesData.items : [];
      const roleItems: { label: string; value: string }[] = rawItems.map(
        (item) => ({
          label: item.name,
          value: item.id.toString(),
        }),
      );

      const userRoleId = userData.role?.id?.toString();
      const userRoleName = userData.role?.name;

      // Merge the user's current role if the roles API didn't include it
      if (userRoleId && !roleItems.some((r) => r.value === userRoleId)) {
        roleItems.push({ label: userRoleName ?? "Unknown Role", value: userRoleId });
      }

      setRoleList(roleItems);
      setRole(userRoleId ?? "");
      setInitialData({
        name: userData.name,
        phoneNumber: userData.phone,
        role: userRoleId ?? "",
        notes: userData.note ?? "",
        isActive: userData.isActive,
      });
    } catch (err) {
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Unsaved changes guard ──

  const hasUnsavedChanges = () => {
    if (!initialData) return false;
    return (
      name !== initialData.name ||
      phoneNumber !== initialData.phoneNumber ||
      role !== initialData.role ||
      notes !== initialData.notes ||
      isActive !== initialData.isActive
    );
  };

  useUnsavedChangesGuard(hasUnsavedChanges, () => setShowUnsavedDialog(true));

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      navigate(UsersUrls.list);
    }
  };
  const handleKeepEditing = () => setShowUnsavedDialog(false);
  const handleDiscardChanges = () => {
    setShowUnsavedDialog(false);
    navigate(UsersUrls.list);
  };
  const handleSaveFromDialog = async () => {
    setShowUnsavedDialog(false);
    await handleSubmission();
  };

  // ── Save handler ──

  const handleSubmission = async () => {
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      phone: phoneNumber.trim(),
      roleId: Number(role),
      isActive,
      note: notes.trim(),
    };

    try {
      await userService.updateUser(parseInt(id, 10), payload);
      navigate(UsersUrls.list);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update user");
    }
  };

  return {
    user,
    name,
    phoneNumber,
    notes,
    isActive,
    role,
    error,
    roles: roleList,
    loading,
    setName,
    setPhoneNumber,
    setRole,
    setIsActive,
    setNotes,
    handleSubmission,
    showUnsavedDialog,
    handleCancel,
    handleKeepEditing,
    handleDiscardChanges,
    handleSaveFromDialog,
  };
};

export { useUserEdit };