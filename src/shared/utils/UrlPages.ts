import UserProfilePage from "@/shared/features/auth/containers/user-profile-page/UserProfilePage";
import { UserListPage } from "@/shared/features/users/containers/user-list-page/UserListPage";
import { UserCreationPage } from "@/shared/features/users/containers/user-creation-page/UserCreationPage";
import { UserEditPage } from "@/shared/features/users/containers/user-edit-page/UserEditPage"; 
import { ALL_USERS } from "../components/helpers/RouteHelper";

const UrlPages = {
  "/profile":            { page: UserProfilePage, allowedUserRoles: ALL_USERS },
  "/users":              { page: UserListPage,    allowedUserRoles: ALL_USERS },
  "/users/create":       { page: UserCreationPage,  allowedUserRoles: ALL_USERS },
  "/users/:id/edit":     { page: UserEditPage,    allowedUserRoles: ALL_USERS }, 
};

const BaseUrls = {
  Home: "/",
  Profile: "/profile",
};

export { UrlPages, BaseUrls };