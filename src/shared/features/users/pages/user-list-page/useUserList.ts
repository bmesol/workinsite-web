// import { useUserService } from "../../services/UserService";
// import { useNavigate } from "react-router-dom";
// import { UsersUrls } from "../../utils/urls";
// import { useEffect, useState } from "react";
// import type { User } from "../../DTOs/User";

// const useUserList = () => {
//   const navigate = useNavigate();
//   const userService = useUserService();
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

import { useUserService } from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { UsersUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import type { User } from "../../DTOs/User";

const useUserList = () => {
  const navigate = useNavigate();
  const userService = useUserService();

  const [userList, setUserList] = useState<User[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState(false);
  const [loading, setLoading] = useState(true);         // ✅ initial load
  const [searchLoading, setSearchLoading] = useState(false); // ✅ search load

  // ✅ Initial load only
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

  // ✅ Search — full page load இல்லை
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

  return {
    userList,
    fetchUser,
    handleUserSelect,
    hasSearchFilter,
    navigate,
    loading,
    searchLoading,
  };
};

export { useUserList };