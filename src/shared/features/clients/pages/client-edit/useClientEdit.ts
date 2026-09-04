import { useContactValidate } from "../../components/ContactValidate/ContactValidate";
import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { useContactService } from "../../../contacts/service/ContactService";
import type { Client, ClientRequest } from "../../DTOs/ClientProps";
import { KYCTypes } from "../../DTOs/ClientProps";
import { useClientService } from "../../service/ClientService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { ClientsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useClientEdit = (id: string, queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const contactService = useContactService();

  const newContactId = queryString.get("contactId") || "";
  const initialContactList: Contact = { id: 0, name: "", contactDetails: [] };
  const initialClientDetails: Client = {
    id: 0,
    name: "",
    note: "",
    contact: initialContactList,
    kycDetails: [],
  };

  const [name, setName] = useState("");
  const [contactId, setContactId] = useState(newContactId);
  const [notes, setNotes] = useState<string>();
  const [clientDetails, setClientDetails] = useState<Client | ClientRequest>(
    initialClientDetails,
  );
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>(initialContactList);
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { error, validate } = useInputValidate({ name });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const fetchClient = async () => {
    setLoading(true);
    try {
      const clientData: Client = await clientService.getClient(parseInt(id));
      setClientDetails(clientData);
      setName(clientData.name);
      setNotes(clientData.note);
      if (!newContactId) setContactId(clientData.contact.id.toString());
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);

  const fetchContacts = async (searchString: string = "") => {
    const contacts = await contactService.getContacts(searchString, false);
    if (contactId && contacts) {
      const validContacts = contacts.filter(
        (item: Contact) => item.id !== parseInt(contactId),
      );
      setContactList([contact, validContacts].flat());
      return;
    }
    if (contacts) setContactList(contacts);
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        const fetchedContact: Contact = await contactService.getContact(
          parseInt(contactId),
        );
        setContact(fetchedContact);
        setContactList([fetchedContact]);
      }
    };
    fetchContactById();
  }, [contactId]);

  const contactDetails = contactList.map((item) => ({
    label: item.name,
    value: item.id.toString(),
  }));
  const handleContactChange = (value: string) => setContactId(value);

  const isAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    (type) =>
      clientDetails.kycDetails.some(
        (item) => item.kycType === type && item.value,
      ),
  );

  const handleContactCreate = (searchString: string) => {
    const redirectParams = new URLSearchParams({
      name: searchString,
      redirect: `${ClientsUrls.edit(parseInt(id))}?`,
    });
    navigate(`${ContactsUrls.create}?${redirectParams.toString()}`);
  };

  const handleContactEdit = () => {
    const redirectParams = new URLSearchParams({
      redirect: `${ClientsUrls.edit(parseInt(id))}?contactId=${contactId}`,
    });
    navigate(
      `${ContactsUrls.edit(parseInt(contactId))}?${redirectParams.toString()}`,
    );
    setIsContactEditOpen(false);
  };

  const handleSubmission = async () => {
    if (validate()) {
      const client = {
        name,
        note: notes as string,
        contactId: parseInt(contactId),
        kycDetails: clientDetails.kycDetails,
      };
      await clientService.updateClient(parseInt(id), client);
      navigate(ClientsUrls.list);
    }
  };

  return {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
    loading,
    navigate,
    handleContactEdit,
    handleSubmission,
    isAddDisabled,
    contactDetails,
    contactId,
    handleContactCreate,
    handleContactChange,
    fetchContacts,
    contact,
    primaryContactDetails,
    hasMoreDetails,
    isContactEditOpen,
    setIsContactEditOpen,
  };
};

export { useClientEdit };
