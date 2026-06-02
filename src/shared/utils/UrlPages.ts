// import UserProfilePage from "@/shared/features/auth/containers/user-profile-page/UserProfilePage";
// import { UserListPage } from "@/shared/features/users/containers/user-list-page/UserListPage";
// import { UserCreationPage } from "@/shared/features/users/containers/user-creation-page/UserCreationPage";
// import { UserEditPage } from "@/shared/features/users/containers/user-edit-page/UserEditPage";
// import { ContactListPage } from "@/shared/features/contacts/pages/contact-list/ContactListPage";
// import { ContactEditPage } from "@/shared/features/contacts/pages/contact-edit/ContactEditPage";
// import { ContactCreationPage } from "@/shared/features/contacts/pages/contact-creation/ContactCreationPage";
// import { ClientListPage } from "@/shared/features/clients/pages/client-list/ClientListPage";
// import { ClientEditPage } from "@/shared/features/clients/pages/client-edit/ClientEditPage";
// import { ClientCreationPage } from "@/shared/features/clients/pages/client-creation/ClientCreationPage";
// import { ALL_USERS } from "@/shared/helpers/RouteHelper";
// import { SiteListPage } from "../features/sites/pages/site-list/SiteListPage";
// import { SiteEditPage } from "@/shared/features/sites/pages/site-edit/SiteEditPage";
// import { SiteCreationPage } from "../features/sites/pages/site-creation/SiteCreationPage";
// import { SupplierListPage } from "@/shared/features/suppliers/pages/supplier-list/SupplierListPage";
// import { SupplierEditPage } from "@/shared/features/suppliers/pages/supplier-edit/SupplierEditPage";
// import { SupplierCreationPage } from "@/shared/features/suppliers/pages/supplier-creation/SupplierCreationPage";
// import WorkerReportPage from "@/shared/features/report/pages/worker-report/WorkerReportPage";
// import WorkerReportDetailsPage from "@/shared/features/report/pages/worker-report-details/WorkerReportDetailsPage";
// import { WorkerListPage } from "@/shared/features/workers/pages/worker-list/WorkerListPage";
// import { WorkerEditPage } from "@/shared/features/workers/pages/worker-edit/WorkerEditPage";
// import { WorkerCreationPage } from "@/shared/features/workers/pages/worker-creation/WorkerCreationPage";
// import { WorkerCategoryListPage } from "../features/workers/pages/worker-category-list/WorkerCategoryListPage";


// const UrlPages = {
//   "/profile":              { page: UserProfilePage,         allowedUserRoles: ALL_USERS },
//   "/users":                { page: UserListPage,             allowedUserRoles: ALL_USERS },
//   "/users/create":         { page: UserCreationPage,         allowedUserRoles: ALL_USERS },
//   "/users/:id/edit":       { page: UserEditPage,             allowedUserRoles: ALL_USERS },
//   "/contacts":             { page: ContactListPage,          allowedUserRoles: ALL_USERS },
//   "/contacts/create":      { page: ContactCreationPage,      allowedUserRoles: ALL_USERS },
//   "/contacts/:id/edit":    { page: ContactEditPage,          allowedUserRoles: ALL_USERS },
//   "/clients":              { page: ClientListPage,           allowedUserRoles: ALL_USERS },
//   "/clients/create":       { page: ClientCreationPage,       allowedUserRoles: ALL_USERS },
//   "/clients/:id/edit":     { page: ClientEditPage,           allowedUserRoles: ALL_USERS },
//   "/sites":                { page: SiteListPage,             allowedUserRoles: ALL_USERS },
//   "/sites/:id/edit":       { page: SiteEditPage,             allowedUserRoles: ALL_USERS },
//   "/sites/create":         { page: SiteCreationPage,         allowedUserRoles: ALL_USERS },
//   "/suppliers":            { page: SupplierListPage,         allowedUserRoles: ALL_USERS },
//   "/suppliers/:id/edit":   { page: SupplierEditPage,         allowedUserRoles: ALL_USERS },
//   "/suppliers/create":     { page: SupplierCreationPage,     allowedUserRoles: ALL_USERS },
//   "/reports/worker":                  { page: WorkerReportPage,        allowedUserRoles: ALL_USERS },
//   "/reports/worker/:workerId":        { page: WorkerReportDetailsPage, allowedUserRoles: ALL_USERS },
//   "/workers":                      { page: WorkerListPage,             allowedUserRoles: ALL_USERS },
//   "/workers/create":               { page: WorkerCreationPage,         allowedUserRoles: ALL_USERS },
//   "/workers/:id/edit":             { page: WorkerEditPage,             allowedUserRoles: ALL_USERS },
//   "/worker-categories":          { page: WorkerCategoryListPage,     allowedUserRoles: ALL_USERS },
// };

// const BaseUrls = {
//   Home: "/",
//   Profile: "/profile",
// };

// export { UrlPages, BaseUrls };

import UserProfilePage from "@/shared/features/auth/containers/user-profile-page/UserProfilePage";
import { UserListPage } from "@/shared/features/users/pages/user-list-page/UserListPage";
import { UserCreationPage } from "@/shared/features/users/pages/user-creation-page/UserCreationPage";
import { UserEditPage } from "@/shared/features/users/pages/user-edit-page/UserEditPage";
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
import { WorkerListPage } from "@/shared/features/workers/pages/worker-list/WorkerListPage";
import { WorkerEditPage } from "@/shared/features/workers/pages/worker-edit/WorkerEditPage";
import { WorkerCreationPage } from "@/shared/features/workers/pages/worker-creation/WorkerCreationPage";
import { WorkerCategoryListPage } from "../features/workers/pages/worker-category-list/WorkerCategoryListPage";
import { WorkerCategoryCreationPage } from "../features/workers/pages/worker-category-creation/WorkerCategoryCreationPage";
import { WorkerCategoryEditPage } from "../features/workers/pages/worker-category-edit/WorkerCategoryEditPage";
import { WorkRateAbstractListPage } from "@/shared/features/workers/pages/workrate-abstract-list/WorkRateAbstractList";
import { WorkRateAbstractCreationPage } from "@/shared/features/workers/pages/workrate-abstract-create/WorkRateAbstractCreate";
import { WorkRateAbstractEditPage } from "@/shared/features/workers/pages/workrate-abstract-edit/WorkRateAbstractEdit";
import { WorkModeCreationPage } from "@/shared/features/workers/pages/worker-mode-creation/WorkerModeCreation"; 
import { ShiftCreationPage } from "@/shared/features/workers/pages/shift-create/ShiftCreationPage"    
import { AttendanceListPage } from "@/shared/features/attendance/pages/attendance-list/AttendanceListPage";
import { AttendanceCreationPage } from "@/shared/features/attendance/pages/attendance-creation/AttendanceCreationPage";
import { AttendanceEditPage } from "@/shared/features/attendance/pages/attendance-edit/AttendanceEditPage";
import { UnitCreationPage } from "@/shared/features/materials/pages/unit-creation/UnitCreationPage"; 


const UrlPages = {
  "/profile":                          { page: UserProfilePage,                allowedUserRoles: ALL_USERS },
  "/users":                            { page: UserListPage,                   allowedUserRoles: ALL_USERS },
  "/users/create":                     { page: UserCreationPage,               allowedUserRoles: ALL_USERS },
  "/users/:id/edit":                   { page: UserEditPage,                   allowedUserRoles: ALL_USERS },
  "/contacts":                         { page: ContactListPage,                allowedUserRoles: ALL_USERS },
  "/contacts/create":                  { page: ContactCreationPage,            allowedUserRoles: ALL_USERS },
  "/contacts/:id/edit":                { page: ContactEditPage,                allowedUserRoles: ALL_USERS },
  "/clients":                          { page: ClientListPage,                 allowedUserRoles: ALL_USERS },
  "/clients/create":                   { page: ClientCreationPage,             allowedUserRoles: ALL_USERS },
  "/clients/:id/edit":                 { page: ClientEditPage,                 allowedUserRoles: ALL_USERS },
  "/sites":                            { page: SiteListPage,                   allowedUserRoles: ALL_USERS },
  "/sites/create":                     { page: SiteCreationPage,               allowedUserRoles: ALL_USERS },
  "/sites/:id/edit":                   { page: SiteEditPage,                   allowedUserRoles: ALL_USERS },
  "/suppliers":                        { page: SupplierListPage,               allowedUserRoles: ALL_USERS },
  "/suppliers/create":                 { page: SupplierCreationPage,           allowedUserRoles: ALL_USERS },
  "/suppliers/:id/edit":               { page: SupplierEditPage,               allowedUserRoles: ALL_USERS },
  "/reports/worker":                   { page: WorkerReportPage,               allowedUserRoles: ALL_USERS },
  "/reports/worker/:workerId":         { page: WorkerReportDetailsPage,        allowedUserRoles: ALL_USERS },
  "/workers":                          { page: WorkerListPage,                 allowedUserRoles: ALL_USERS },
  "/workers/create":                   { page: WorkerCreationPage,             allowedUserRoles: ALL_USERS },
  "/workers/:id/edit":                 { page: WorkerEditPage,                 allowedUserRoles: ALL_USERS },
  "/worker-categories":                { page: WorkerCategoryListPage,         allowedUserRoles: ALL_USERS },
  "/worker-categories/create":         { page: WorkerCategoryCreationPage,     allowedUserRoles: ALL_USERS },
  "/worker-categories/:id/edit":       { page: WorkerCategoryEditPage,         allowedUserRoles: ALL_USERS },
  "/work-rate-abstracts":              { page: WorkRateAbstractListPage,       allowedUserRoles: ALL_USERS },
  "/work-rate-abstracts/create":       { page: WorkRateAbstractCreationPage,   allowedUserRoles: ALL_USERS },
  "/work-rate-abstracts/:id/edit":     { page: WorkRateAbstractEditPage,       allowedUserRoles: ALL_USERS },
  "/work-modes":                       { page: WorkModeCreationPage,               allowedUserRoles: ALL_USERS }, 
 "/workers/shift":                    { page: ShiftCreationPage,              allowedUserRoles: ALL_USERS },
 "/attendance":                       { page: AttendanceListPage,             allowedUserRoles: ALL_USERS },
  "/attendance/create":                { page: AttendanceCreationPage,         allowedUserRoles: ALL_USERS },
  "/attendance/:id/edit":              { page: AttendanceEditPage,             allowedUserRoles: ALL_USERS },
  "/materials/unit":                   { page: UnitCreationPage,               allowedUserRoles: ALL_USERS }, 
};

const BaseUrls = {
  Home: "/",
  Profile: "/profile",
};

export { UrlPages, BaseUrls };