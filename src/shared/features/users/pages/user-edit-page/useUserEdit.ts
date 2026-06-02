import { useInputValidate } from "@/shared/features/users/components/InputValidate/InputValidate";
import { useUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import type { User } from "@/shared/features/users/DTOs/User";
import { toast } from "sonner";

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useUserEdit = (id: string) => {
  const [name, setName]             = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole]             = useState("");
  const [notes, setNotes]           = useState("");
  const [isActive, setIsActive]     = useState(true);
  const [user, setUser]             = useState<User>();
  const [loading, setLoading] = useState(true);

  const { roles, error, validate } = useInputValidate({ name, phoneNumber, role });
  const navigate     = useNavigate();
  const userService  = useUserService();

  // ── Fetch user on mount ──

const fetchUser = async () => {
    setLoading(true); 
    try {
      const userData = await userService.getUser(parseInt(id));
      setUser(userData);
      setName(userData.name);
      setPhoneNumber(userData.phone);
      setRole(userData.role.id.toString());
      setNotes(userData.note ?? "");
      setIsActive(userData.isActive);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUser(); }, []);

  // ── Save handler ──

  const handleSubmission = async () => {
    if (!validate()) return;

    const payload = {
      name,
      phone:    phoneNumber,
      roleId:   Number(role),
      isActive,
      note:     notes,
    };

    try {
      await userService.updateUser(parseInt(id), payload);
      navigate(UsersUrls.list);
    } catch (err: any) {
      err.response?.data?.forEach((i: any) =>
        toast.error(i.message)
      );
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
    roles,
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