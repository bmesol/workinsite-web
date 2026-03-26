import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { UserCard } from "../../components/UserCard/UserCard";
import { UsersUrls } from "../../utils/urls";
import { useUserList } from "../user-list-page/useUserList";

const UserListPage = () => {
  const { userList, fetchUser, handleUserSelect, hasSearchFilter, navigate } = useUserList();

  if (!userList.length && !hasSearchFilter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
  <p className="text-muted-foreground">No users found</p>
  <Button className="mt-4" onClick={() => navigate(UsersUrls.create)}>
    Create User
  </Button>
</div>
    );
  }

  return (
    <div className="container min-h-screen px-4 py-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Users</h1>
        <Button onClick={() => navigate(UsersUrls.create)}>
          Create User
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-4">
        <Input
          className="w-full md:w-72"
          placeholder="Search users..."
          onChange={(e) => fetchUser(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!userList.length ? (
          <div className="col-span-2 text-center text-muted-foreground my-4">
            No users found
          </div>
        ) : (
          userList.map((user) => (
            <div key={user.id} onClick={() => handleUserSelect(user.id)}>
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

