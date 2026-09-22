import type { Contact } from "../../contacts/DTOs/ContactProps";
import type { Client } from "../../clients/DTOs/ClientProps";
import type { User } from "../../users/DTOs/User";
import { SITE_STATUS } from "@/shared/constants/appEnums";

const SiteStatus = SITE_STATUS;
type SiteStatus = (typeof SITE_STATUS)[keyof typeof SITE_STATUS];

interface SiteCreationRequest {
  name: string;
  clientId: number;
  googleLocation: string;
  note: string;
  contactId: number;
  supervisorIds: number[];
  status: string;
}

interface SiteUpdationRequest extends SiteCreationRequest {
  status: string;
}

interface Site {
  id: number;
  name: string;
  client: Client;
  googleLocation: string;
  note: string;
  contact: Contact;
  supervisors: User[];
  status: string;
  wageType: { id: number; name: string; isActive: boolean }; // 👈 add

}

export type { SiteCreationRequest, SiteUpdationRequest, Site };
export { SiteStatus };