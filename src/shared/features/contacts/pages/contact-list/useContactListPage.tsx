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
  const [loading, setLoading] = useState(true);         
  const [searchLoading, setSearchLoading] = useState(false); 
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const contactData = await contactService.getContacts("");
        setContactList(contactData);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const fetchContact = async (searchString: string = "") => {
    setSearchLoading(true);
    try {
      const contactData = await contactService.getContacts(searchString);
      setHasSearchFilter(searchString !== "");
      setContactList(contactData);
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshList = async () => {
    const contactData = await contactService.getContacts("");
    setContactList(contactData);
  };

  const handleContactSelect = (id: number) => navigate(ContactsUrls.edit(id));

  // ✅ Confirm delete trigger
  const confirmDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  // ✅ Actual delete
  const handleContactDelete = async (id: number) => {
    try {
      await contactService.deleteContact(id);
      setDeleteId(null);
      refreshList(); 
    } catch (error: any) {
      setDeleteId(null);
      error.response.data.forEach((i: any) => {
        const messages = JSON.parse(i.message);
        messages.forEach((message: string) =>
          toast.error(`Couldn't Delete — ${message}`)
        );
      });
    }
  };

  return {
    contactList,
    fetchContact,
    handleContactSelect,
    confirmDelete,
    handleContactDelete,
    hasSearchFilter,
    loading,
    searchLoading,
    deleteId,
    setDeleteId,
  };
};

export { useContactList };