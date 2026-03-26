import { useUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import type { User } from "../../DTOs/User";

const useUserList = () => {
  const navigate = useNavigate();
  const userService = useUserService();
  const [userList, setUserList] = useState<User[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

  const fetchUser = async (searchString: string = "") => {
    const userList = await userService.getUsers(searchString);
    if(!!searchString) setHasSearchFilter(true);
    setUserList(userList);
  };

  useEffect(() => { fetchUser() }, []);

  const handleUserSelect = (id: number) => navigate(UsersUrls.edit(id));

  return { userList, fetchUser, handleUserSelect, hasSearchFilter, navigate };
};

export { useUserList };
