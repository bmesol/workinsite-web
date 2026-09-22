// import { createUserService } from "../../services/UserService";
// import { useNavigate } from "react-router-dom";
// import { UsersUrls } from "../../utils/urls";
// import { useEffect, useState } from "react";
// import type { User } from "../../DTOs/User";

// const useUserList = () => {
//   const navigate = useNavigate();
//   const userService = createUserService();
//   const [userList, setUserList] = useState<User[]>([]);
//   const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

//   const fetchUser = async (searchString: string = "") => {
//     const userList = await userService.getUsers(searchString);
//     if(!!searchString) setHasSearchFilter(true);
//     setUserList(userList);
//   };

//   useEffect(() => { fetchUser() }, []);

//   const handleUserSelect = (id: number) => navigate(UsersUrls.edit(id));

//   return { userList, fetchUser, handleUserSelect, hasSearchFilter, navigate };
// };

// export { useUserList };

import { createUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import type { User } from "../../DTOs/User";

const useUserList = () => {
  const navigate = useNavigate();
  const userService = createUserService();

  const [userList, setUserList] = useState<User[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const users = await userService.getUsers("");
        setUserList(users);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const fetchUser = async (searchString: string = "") => {
    setSearchLoading(true);
    try {
      const users = await userService.getUsers(searchString);
      setHasSearchFilter(searchString !== "");
      setUserList(users);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUserSelect = (id: number) => navigate(UsersUrls.edit(id));
  const handleCreate = () => navigate(UsersUrls.create);

  return {
    userList,
    fetchUser,
    handleUserSelect,
    handleCreate,
    hasSearchFilter,
    loading,
    searchLoading,
  };
};

export { useUserList };