import {
  Users,
  Contact,
  Briefcase,
  MapPin,
  HardHat,
  Truck,
} from "lucide-react";
import { ADMIN_USERS, ALL_USERS } from "@/shared/components/helpers/RouteHelper";

const MenuItems = {
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
  },
  "/suppliers": {
    label: "Suppliers",
    icon: Truck,
    allowedUserRoles: ALL_USERS,
  },
};

export { MenuItems };
