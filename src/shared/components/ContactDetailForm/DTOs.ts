import type { Contact } from "@/shared/features/contacts/DTOs/ContactProps";

interface ContactDetailFormProps {
  handleContactEdit: () => void;
  primaryContactDetails: Contact;
  hasMoreDetails: boolean;
  handleMoreDetails: () => void;
  isColsTwo?: boolean;
  classNames?: string;
}

export type { ContactDetailFormProps };