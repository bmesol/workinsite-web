import type { ContactListType } from "../../DTOs/ContactList";
import type { ContactDetail } from "../../DTOs/ContactProps";

interface ContactEditDeleteButtonsProps extends ContactListType {
  selectedItem: { id: number, item: ContactDetail };
}

export type { ContactEditDeleteButtonsProps };
