import type { Contact } from "../../contacts/DTOs/ContactProps";
import type { Client } from "../../clients/DTOs/ClientProps";
import type { User } from "../../users/DTOs/User";

const SiteStatus = {
  YET_TO_START: "Yet to start",
  WORKING: "Working",
  HOLD: "Hold",
  COMPLETED: "Completed",
} as const;

type SiteStatus = (typeof SiteStatus)[keyof typeof SiteStatus];

interface SiteCreationRequest {
  name: string;
  clientId: number;
  googleLocation: string;
  note: string;
  contactId: number;
  supervisorIds: number[];
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