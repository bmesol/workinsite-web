const ContactTypes = {
  PHONE: "Phone",
  EMAIL: "Email",
  ADDRESS: "Address",
} as const;

type ContactTypes = typeof ContactTypes[keyof typeof ContactTypes];

interface ContactDetail {
  contactType: ContactTypes;
  value: string;
}

interface ContactRequest {
  name: string;
    phone?: string;   
  email?: string;
  contactDetails: ContactDetail[];
}

interface Contact extends ContactRequest {
  id: number;
}

export  { ContactTypes };
export type { ContactDetail, ContactRequest, Contact };