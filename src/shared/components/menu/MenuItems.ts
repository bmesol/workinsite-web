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
  LayoutDashboard,
  Droplet
} from "lucide-react";
import { ADMIN_USERS, ALL_USERS, SUPERVISOR_ONLY } from "@/shared/helpers/RouteHelper";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

export type MenuChildItem = {
  label: string;
  href: string;
};

export type MenuItem = {
  label: string;
  icon: ElementType;
  allowedUserRoles: number[];
  children?: MenuChildItem[];
};

const MenuItems: Record<string, MenuItem> = {
  
  "/dashboard": {
    label: "Home",
    icon: LayoutDashboard,
    allowedUserRoles: SUPERVISOR_ONLY,
  },
  "/roles-rights": {
    label: "Roles & Rights",
    icon: ShieldCheck,
    allowedUserRoles: ADMIN_USERS,
  },
  "/users": {
    label: "Users",
    icon: Users,
    allowedUserRoles: ADMIN_USERS,
  },
  "/contacts": {
    label: "Contacts",
    icon: Contact,
    allowedUserRoles: ADMIN_USERS,
  },
  "/clients": {
    label: "Clients",
    icon: Briefcase,
    allowedUserRoles: ADMIN_USERS,
  },
  "/sites": {
    label: "Sites",
    icon: MapPin,
    allowedUserRoles: ADMIN_USERS,
  },
  "/workers": {
    label: "Workers",
    icon: HardHat,
    allowedUserRoles: ADMIN_USERS,
    children: [
      { label: "Worker", href: "/workers" },
      { label: "Worker Category", href: "/worker-categories" },
      { label: "Work Rate Abstract", href: "/work-rate-abstracts" },
      { label: "Work Mode", href: "/work-modes" },
      { label: "Shift", href: "/workers/shift" },
    ],
  },
  "/suppliers": {
    label: "Suppliers",
    icon: Truck,
    allowedUserRoles: ADMIN_USERS,
  },
  "/materials": {
    label: "Materials",
    icon: Package,
    allowedUserRoles: ADMIN_USERS,
    children: [
      { label: "Unit", href: "/materials/unit" },
      { label: "Material", href: "/materials" },
      { label: "Purchase", href: "/materials/purchase" },
      { label: "Material Used", href: "/materials/used" },
      { label: "Material Shift", href: "/materials/shift" },
    ],
  },
 "/curing": {
  label: "Curing",
  icon: Droplet,
  allowedUserRoles: [ROLE_IDS.SUPER_ADMIN, ROLE_IDS.ADMIN, ROLE_IDS.ENGINEER], // ALL_USERS → இது மாத்து
  children: [
    { label: "Curing", href: "/curing" },
    { label: "Curing Types", href: "/curing/types" },
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
    children: [
      { label: "Client Transaction", href: "/transactions/client" },
      { label: "Supplier Transaction", href: "/transactions/supplier" },
      { label: "Worker Transaction", href: "/transactions/worker" },
    ],
  },
  "/reports": {
    label: "Reports",
    icon: FileText,
    allowedUserRoles: ALL_USERS,
    children: [
      { label: "Worker Report", href: "/reports/worker" },
      { label: "Supervisor Attendance Report", href: "/reports/supervisor-attendance" },
      { label: "Available Material Report", href: "/reports/available-material" },
    ],
  },
"/task": {
  label: "Task",
  icon: ClipboardList,
  allowedUserRoles: [ROLE_IDS.SUPERVISOR, ROLE_IDS.ENGINEER, ROLE_IDS.ADMIN, ROLE_IDS.SUPER_ADMIN], // SUPERVISOR_ONLY → இது மாத்து
},
};

export { MenuItems };