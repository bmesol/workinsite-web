import { useContactService } from "@/shared/features/contacts/service/ContactService";
import { toast } from "sonner"; 
import type { Contact } from "@/shared/features/contacts/DTOs/ContactProps";
import { ContactsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useContactList = () => {
  const navigate = useNavigate();
  const contactService = useContactService();

  const [contactList, setContactList] = useState<Contact[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

  const fetchContact = async (searchString: string = "") => {
    const contactData = await contactService.getContacts(searchString);
    if (!!searchString) setHasSearchFilter(true);
    setContactList(contactData);
  };

  useEffect(() => { fetchContact(); }, []);

  const handleContactSelect = (id: number) => navigate(ContactsUrls.edit(id));

  const handleContactDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await contactService.deleteContact(id);
    } catch (error: any) {
      error.response.data.forEach((i: any) => {
        const messages = JSON.parse(i.message);
        messages.forEach((message: string) =>
          toast.error(`Couldn't Delete — ${message}`)
        );
      });
      return;
    }
    window.location.reload();
  };

  return { contactList, fetchContact, handleContactSelect, handleContactDelete, hasSearchFilter };
};

export { useContactList };