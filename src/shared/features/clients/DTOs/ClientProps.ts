import type { Contact } from "@/shared/features/contacts/DTOs/ContactProps";

const KYCTypes = {
  AADHAAR: "AADHAAR",
  PAN: "PAN",
  GST: "GST",
} as const;

type KYCTypes = typeof KYCTypes[keyof typeof KYCTypes];

interface KYCDetail {
  kycType: KYCTypes;
  value: string;
}

interface ClientRequest {
  name: string;
  contactId: number;
  note: string;
  kycDetails: KYCDetail[];
}

interface Client {
  id: number;
  name: string;
  note: string;
  contact: Contact;
  kycDetails: KYCDetail[];
}

export { KYCTypes };
export type { ClientRequest, Client, KYCDetail };
