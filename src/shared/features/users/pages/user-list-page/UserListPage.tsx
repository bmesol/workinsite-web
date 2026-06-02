import { UserGetStartedPage } from "../user-get-started-page/UserGetStartedPage";
import { Header, Actions } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { UserStatus } from "../../components/UserStatus/UserStatus";
import { UserCard } from "@/shared/features/users/components/UserCard/UserCard";
import { UsersUrls } from "../../utils/urls";
import { useUserList } from "./useUserList";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar"; 
import { useState } from "react";

const UserListPage = () => {
  const {
    userList,
    fetchUser,
    handleUserSelect,
    hasSearchFilter,
    navigate,
    loading,
    searchLoading,
  } = useUserList();

  const [searchValue, setSearchValue] = useState("");

  // ✅ Initial loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!userList.length && !hasSearchFilter) return <UserGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">

      {/* Header */}
      <Header title="Users">
        <Actions>
          <UserStatus />
          <Button onClick={() => navigate(UsersUrls.create)}>Create User</Button>
        </Actions>
      </Header>

      {/* SearchBar ✅ */}
      <div className="flex justify-end mb-4 mt-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchValue}
            setSearchText={(val) => {
              setSearchValue(val);
              fetchUser(val); // ✅ type பண்ண பண்ண search
            }}
            searchCategory="Users"
          />
          {/* ✅ Search loading */}
          {searchLoading && (
            <p className="text-xs text-muted-foreground mt-1 text-right">
              Searching...
            </p>
          )}
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 w-full">
        {!userList.length ? (
          <div className="col-span-2 text-center text-sm text-muted-foreground my-4">
            No users found
          </div>
        ) : (
          userList.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="cursor-pointer w-full"
            >
              <UserCard
                name={user.name}
                role={user.role.name}
                phoneNumber={user.phone}
                isActive={user.isActive}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { UserListPage };