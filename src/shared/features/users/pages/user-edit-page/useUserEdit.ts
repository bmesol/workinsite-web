import { useInputValidate } from "@/shared/features/users/components/InputValidate/InputValidate";
import { useUserService } from "../../services/UserService";
import { useRoleService } from "../../services/RoleService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
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

  const { error, validate } = useInputValidate({ name, phoneNumber, role });
  const navigate = useNavigate();
  const userService = useUserService();
  const roleService = useRoleService();

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

      const rawItems = Array.isArray(rolesData?.items) ? rolesData.items : [];
      const roleItems: { label: string; value: string }[] = rawItems.map(
        (item: any) => ({
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
      const errors = Array.isArray(err?.response?.data) ? err.response.data : [];
      if (errors.length > 0) {
        errors.forEach((i: any) => toast.error(i.message ?? "Failed to update user"));
      } else {
        toast.error("Failed to update user");
      }
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
    navigate,
  };
};

export { useUserEdit };