import { UserGetStartedPage } from "../user-get-started-page/UserGetStartedPage"; 
import { Header, Actions } from "@/shared/components/Header/Header";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { UserStatus } from "../../components/UserStatus/UserStatus"; 
import { UserCard } from "@/shared/features/users/components/UserCard/UserCard";
import { UsersUrls } from "../../utils/urls";
import { useUserList } from "./useUserList";

const UserListPage = () => {
  const { userList, fetchUser, handleUserSelect, hasSearchFilter, navigate } = useUserList();

  if (!userList.length && !hasSearchFilter) return <UserGetStartedPage />; 

  return (
    <div className="container min-h-screen px-4 py-6">

      {/* ── Header ── */}
      <Header title="Users">
        <Actions>
          <UserStatus /> 
          <Button onClick={() => navigate(UsersUrls.create)}>Create User</Button>
        </Actions>
      </Header>

      {/* ── Search ── */}
      <div className="flex justify-end mb-4 mt-4">
        <Input
          className="w-full md:w-72"
          placeholder="Search users..."
          onChange={(e) => fetchUser(e.target.value)}
        />
      </div>

      {/* ── User Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {!userList.length ? (
          <div className="col-span-2 text-center text-sm text-muted-foreground my-4">
            No users found
          </div>
        ) : (
          userList.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className="cursor-pointer"
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

