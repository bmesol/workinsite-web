import type { ContactListType } from "../../DTOs/ContactList";

interface ContactTypesProps extends ContactListType {
  showEditDeleteButtons?: boolean;
  classNames?: string;
  disabled?: boolean;
}

export type { ContactTypesProps };
