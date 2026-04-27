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
import { SiteListPage } from "../features/sites/pages/site-list/SiteListPage";
import { SiteEditPage } from "@/shared/features/sites/pages/site-edit/SiteEditPage";
import { SiteCreationPage } from "../features/sites/pages/site-creation/SiteCreationPage";
import { SupplierListPage } from "@/shared/features/suppliers/pages/supplier-list/SupplierListPage";
import { SupplierEditPage } from "@/shared/features/suppliers/pages/supplier-edit/SupplierEditPage";
import { SupplierCreationPage } from "@/shared/features/suppliers/pages/supplier-creation/SupplierCreationPage";
import WorkerReportPage from "@/shared/features/report/pages/worker-report/WorkerReportPage";
import WorkerReportDetailsPage from "@/shared/features/report/pages/worker-report-details/WorkerReportDetailsPage";

const UrlPages = {
  "/profile":              { page: UserProfilePage,         allowedUserRoles: ALL_USERS },
  "/users":                { page: UserListPage,             allowedUserRoles: ALL_USERS },
  "/users/create":         { page: UserCreationPage,         allowedUserRoles: ALL_USERS },
  "/users/:id/edit":       { page: UserEditPage,             allowedUserRoles: ALL_USERS },
  "/contacts":             { page: ContactListPage,          allowedUserRoles: ALL_USERS },
  "/contacts/create":      { page: ContactCreationPage,      allowedUserRoles: ALL_USERS },
  "/contacts/:id/edit":    { page: ContactEditPage,          allowedUserRoles: ALL_USERS },
  "/clients":              { page: ClientListPage,           allowedUserRoles: ALL_USERS },
  "/clients/create":       { page: ClientCreationPage,       allowedUserRoles: ALL_USERS },
  "/clients/:id/edit":     { page: ClientEditPage,           allowedUserRoles: ALL_USERS },
  "/sites":                { page: SiteListPage,             allowedUserRoles: ALL_USERS },
  "/sites/:id/edit":       { page: SiteEditPage,             allowedUserRoles: ALL_USERS },
  "/sites/create":         { page: SiteCreationPage,         allowedUserRoles: ALL_USERS },
  "/suppliers":            { page: SupplierListPage,         allowedUserRoles: ALL_USERS },
  "/suppliers/:id/edit":   { page: SupplierEditPage,         allowedUserRoles: ALL_USERS },
  "/suppliers/create":     { page: SupplierCreationPage,     allowedUserRoles: ALL_USERS },
  "/reports/worker":                  { page: WorkerReportPage,        allowedUserRoles: ALL_USERS },
  "/reports/worker/:workerId":        { page: WorkerReportDetailsPage, allowedUserRoles: ALL_USERS },
};

const BaseUrls = {
  Home: "/",
  Profile: "/profile",
};

export { UrlPages, BaseUrls };