import type { ElementType } from "react";
import { ROLE_IDS } from '@/shared/features/rolesandrights/DTOs/DTOs';
import {
  Users,
  Contact,
  Briefcase,
  MapPin,
  HardHat,
  Truck,
  Package,
  CalendarCheck,
  ArrowLeftRight,
  FileText,
  ShieldCheck,
  ClipboardList,
  Home,
  Droplet
} from "lucide-react";
import { ADMIN_USERS, ALL_USERS, SUPERVISOR_ONLY } from "@/shared/helpers/RouteHelper";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export type MenuChildItem = {
  label: string;
  href: string;
  permissionKey?: string;
};

export type MenuItem = {
  label: string;
  icon: ElementType;
  allowedUserRoles: number[];
  /** Backend page name(s) used to check pageRights visibility for non-admin roles. Defaults to label. */
  permissionKeys?: string[];
  children?: MenuChildItem[];
};

const MenuItems: Record<string, MenuItem> = {

  "/dashboard": {
    label: "Home",
    icon: Home,
    allowedUserRoles: ALL_USERS,
  },
  "/roles-rights": {
    label: "Roles & Rights",
    icon: ShieldCheck,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Roles & Rights"],
  },
  "/users": {
    label: "Users",
    icon: Users,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Users"],
  },
  "/contacts": {
    label: "Contacts",
    icon: Contact,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Contacts"],
  },
  "/clients": {
    label: "Clients",
    icon: Briefcase,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Clients"],
  },
  "/sites": {
    label: "Sites",
    icon: MapPin,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Sites"],
  },
  "/workers": {
    label: "Workers",
    icon: HardHat,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Workers", "Worker", "Work Mode", "Shift", "Work Rate Abstract", "Worker Category"],
    children: [
      { label: "Worker", href: "/workers", permissionKey: "Worker" },
      { label: "Worker Category", href: "/worker-categories", permissionKey: "Worker Category" },
      { label: "Work Rate Abstract", href: "/work-rate-abstracts", permissionKey: "Work Rate Abstract" },
      { label: "Work Mode", href: "/work-modes", permissionKey: "Work Mode" },
      { label: "Shift", href: "/workers/shift", permissionKey: "Shift" },
    ],
  },
  "/suppliers": {
    label: "Suppliers",
    icon: Truck,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Suppliers"],
  },
  "/materials": {
    label: "Materials",
    icon: Package,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Materials", "Material", "Unit", "Purchase", "Material Used", "Material Shift"],
    children: [
      { label: "Unit", href: "/materials/unit", permissionKey: "Unit" },
      { label: "Material", href: "/materials", permissionKey: "Material" },
      { label: "Purchase", href: "/materials/purchase", permissionKey: "Purchase" },
      { label: "Material Used", href: "/materials/used", permissionKey: "Material Used" },
      { label: "Material Shift", href: "/materials/shift", permissionKey: "Material Shift" },
    ],
  },
  "/curing": {
    label: "Curing",
    icon: Droplet,
    allowedUserRoles: [ROLE_IDS.SUPER_ADMIN, ROLE_IDS.ADMIN, ROLE_IDS.ENGINEER],
    permissionKeys: ["Curing", "Curing Types"],
    children: [
      { label: "Curing", href: "/curing", permissionKey: "Curing" },
      { label: "Curing Types", href: "/curing/types", permissionKey: "Curing Types" },
    ],
  },
  "/attendance": {
    label: "Attendance",
    icon: CalendarCheck,
    allowedUserRoles: ALL_USERS,
  },
  "/transactions": {
    label: "Transaction",
    icon: ArrowLeftRight,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: ["Transaction", "Transactions", "Worker Transaction", "Supplier Transaction", "Client Transaction"],
    children: [
      { label: "Client Transaction", href: "/transactions/client", permissionKey: "Client Transaction" },
      { label: "Supplier Transaction", href: "/transactions/supplier", permissionKey: "Supplier Transaction" },
      { label: "Worker Transaction", href: "/transactions/worker", permissionKey: "Worker Transaction" },
    ],
  },
  "/reports": {
    label: "Reports",
    icon: FileText,
    allowedUserRoles: ADMIN_USERS,
    permissionKeys: [
      "Reports",
      "Worker Report",
      "Attendance Report",
      "Supervisor Attendance Report",
      "Available Material Report",
      "Inventory Stock Report",
    ],
    children: [
      { label: "Worker Report", href: "/reports/worker", permissionKey: "Worker Report" },
      { label: "Supervisor Attendance Report", href: "/reports/supervisor-attendance", permissionKey: "Supervisor Attendance Report" },
      { label: "Available Material Report", href: "/reports/available-material", permissionKey: "Available Material Report" },
      { label: "Inventory Stock Report", href: "/reports/inventory-stock", permissionKey: "Inventory Stock Report" },
    ],
  },
  "/task": {
    label: "Task",
    icon: ClipboardList,
    allowedUserRoles: [ROLE_IDS.SUPERVISOR, ROLE_IDS.ENGINEER, ROLE_IDS.ADMIN, ROLE_IDS.SUPER_ADMIN],
  },
};

export { MenuItems };
