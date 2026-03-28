import type { ElementType } from "react";
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
} from "lucide-react";
import { ADMIN_USERS, ALL_USERS } from "@/shared/components/helpers/RouteHelper";

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
    allowedUserRoles: ALL_USERS,
  },
  "/clients": {
    label: "Clients",
    icon: Briefcase,
    allowedUserRoles: ALL_USERS,
  },
  "/sites": {
    label: "Sites",
    icon: MapPin,
    allowedUserRoles: ALL_USERS,
  },
  "/workers": {
    label: "Workers",
    icon: HardHat,
    allowedUserRoles: ALL_USERS,
    children: [
      { label: "Worker", href: "/workers" },
      { label: "Worker Category", href: "/workers/category" },
      { label: "Work Rate Abstract", href: "/workers/rate-abstract" },
      { label: "Work Mode", href: "/workers/work-mode" },
      { label: "Shift", href: "/workers/shift" },
    ],
  },
  "/suppliers": {
    label: "Suppliers",
    icon: Truck,
    allowedUserRoles: ALL_USERS,
  },
  "/materials": {
    label: "Materials",
    icon: Package,
    allowedUserRoles: ALL_USERS,
    children: [
      { label: "Unit", href: "/materials/unit" },
      { label: "Material", href: "/materials" },
      { label: "Purchase", href: "/materials/purchase" },
      { label: "Material Used", href: "/materials/used" },
      { label: "Material Shift", href: "/materials/shift" },
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
    allowedUserRoles: ALL_USERS,
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
    ],
  },
};

export { MenuItems };