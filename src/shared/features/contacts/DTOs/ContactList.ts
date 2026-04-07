import type { ContactRequest, Contact } from "./ContactProps";

interface ContactListType {
  contactList: ContactRequest | Contact;
  setContactList?: React.Dispatch<React.SetStateAction<ContactRequest | Contact>>;
}

export type { ContactListType };