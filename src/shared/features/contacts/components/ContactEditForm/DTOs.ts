import type { ContactListType } from "../../DTOs/ContactList";
import { ContactTypes } from "../../DTOs/ContactProps";

interface ContactEditFormProps extends ContactListType {
  selectedItem: { id: number, type: ContactTypes, value: string };
}

export type { ContactEditFormProps };
