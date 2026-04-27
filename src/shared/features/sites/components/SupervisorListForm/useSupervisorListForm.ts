import { useUserService } from "../../../users/services/UserService";
import type { SupervisorListFormProps } from "./DTOs";
import type { User } from "@/shared/features/users/DTOs/User";
import { useEffect, useState } from "react";

const useSupervisorListForm = (props: SupervisorListFormProps) => {
  const { supervisorIds, setSupervisorIds } = props;
  const userService = useUserService();

  const [supervisorList, setSupervisorList] = useState<User[]>([]);

  const getSupervisors = async () => {
    const supervisorsData = await Promise.all(supervisorIds.map((id) => userService.getUser(id)));
    setSupervisorList(supervisorsData);
  };

  useEffect(() => { getSupervisors(); }, [supervisorIds]);

  const handleSupervisorDelete = (id: number) => {
    const filteredSupervisors = supervisorIds.filter((ids) => ids !== id);
    setSupervisorIds(filteredSupervisors);
  };

  return { supervisorList, handleSupervisorDelete };
};

export { useSupervisorListForm };