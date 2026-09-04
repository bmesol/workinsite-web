import { useUserService } from "../../../users/services/UserService";
import { UsersUrls } from "../../../users/utils/urls";
import type { SupervisorAddFormProps } from "./DTOs";
import type { User } from "../../../users/DTOs/User";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useSupervisorAddForm = (props: SupervisorAddFormProps) => {
  const { redirectUrl, redirectParams, supervisorIds, setSupervisorIds, onClose } = props;

  const navigate = useNavigate();
  const userService = useUserService();
  const [supervisorId, setSupervisorId] = useState("");
  const [supervisor, setSupervisor] = useState<User>();
  const [supervisorList, setSupervisorList] = useState<User[]>([]);

  const fetchSupervisors = async (searchString: string = "") => {
    const supervisors = await userService.getUsers(searchString);
    if (!supervisors) return;

    const validSupervisors = supervisors.filter((item: User) =>
      supervisorId
        ? item.id !== parseInt(supervisorId) && !supervisorIds.includes(item.id)
        : !supervisorIds.includes(item.id)
    );

    setSupervisorList(
      supervisorId && supervisor
        ? ([supervisor, ...validSupervisors].filter(Boolean) as User[])
        : validSupervisors
    );
  };

  useEffect(() => {
    const fetchSupervisorById = async () => {
      if (supervisorId) {
        const found = await userService.getUser(parseInt(supervisorId));
        setSupervisor(found);
        setSupervisorList([found]);
      }
    };
    fetchSupervisorById();
  }, [supervisorId]);

  const supervisorDetails = supervisorList.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSupervisorChange = (value: string) => setSupervisorId(value);

  const handleSupervisorCreate = (searchString: string) => {
    onClose?.(); 
    const supervisorCreateParams = new URLSearchParams({
      name: searchString,
      redirect: `${redirectUrl}?${redirectParams.toString()}`,
    });
    navigate(`${UsersUrls.create}?${supervisorCreateParams}`);
  };

  const handleAdd = () => {
    if (supervisorId) {
      setSupervisorIds((prev) => [...prev, parseInt(supervisorId)]);
    }
    onClose?.();
  };

  return {
    supervisorDetails,
    supervisorId,
    handleSupervisorCreate,
    handleSupervisorChange,
    fetchSupervisors,
    handleAdd,
  };
};

export { useSupervisorAddForm };