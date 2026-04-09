import UserProfilePage from "@/shared/features/auth/containers/user-profile-page/UserProfilePage";
import { UserListPage } from "@/shared/features/users/containers/user-list-page/UserListPage";
import { UserCreationPage } from "@/shared/features/users/containers/user-creation-page/UserCreationPage";
import { UserEditPage } from "@/shared/features/users/containers/user-edit-page/UserEditPage";
import { ContactListPage } from "@/shared/features/contacts/pages/contact-list/ContactListPage";
import { ContactEditPage } from "@/shared/features/contacts/pages/contact-edit/ContactEditPage";
import { ContactCreationPage } from "@/shared/features/contacts/pages/contact-creation/ContactCreationPage";
import { ClientListPage } from "@/shared/features/clients/pages/client-list/ClientListPage";
import { ClientEditPage } from "@/shared/features/clients/pages/client-edit/ClientEditPage";
import { ClientCreationPage } from "@/shared/features/clients/pages/client-creation/ClientCreationPage";
import { ALL_USERS } from "@/shared/helpers/RouteHelper";

const UrlPages = {
  "/profile":              { page: UserProfilePage,      allowedUserRoles: ALL_USERS },
  "/users":                { page: UserListPage,          allowedUserRoles: ALL_USERS },
  "/users/create":         { page: UserCreationPage,      allowedUserRoles: ALL_USERS },
  "/users/:id/edit":       { page: UserEditPage,          allowedUserRoles: ALL_USERS },
  "/contacts":             { page: ContactListPage,       allowedUserRoles: ALL_USERS },
  "/contacts/create":      { page: ContactCreationPage,   allowedUserRoles: ALL_USERS },
  "/contacts/:id/edit":    { page: ContactEditPage,       allowedUserRoles: ALL_USERS },
  "/clients":              { page: ClientListPage,        allowedUserRoles: ALL_USERS },
  "/clients/create":       { page: ClientCreationPage,    allowedUserRoles: ALL_USERS },
  "/clients/:id/edit":     { page: ClientEditPage,        allowedUserRoles: ALL_USERS },
};

const BaseUrls = {
  Home: "/",
  Profile: "/profile",
};

export { UrlPages, BaseUrls };