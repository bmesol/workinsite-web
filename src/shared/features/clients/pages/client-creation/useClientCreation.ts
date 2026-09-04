import { useContactValidate } from "../../components/ContactValidate/ContactValidate";
import { useInputValidate } from "../../components/InputValidate/InputValidate";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import type { Client, ClientRequest } from "../../DTOs/ClientProps";
import { KYCTypes } from "../../DTOs/ClientProps";
import { useClientService } from "../../service/ClientService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { ClientsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useClientCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const contactService = useContactService();

  const getQueryParam = (param: string) => queryString.get(param) || "";
  const queryStringRedirectUrl = getQueryParam("redirect");

  const [name, setName] = useState(getQueryParam("name"));
  const [notes, setNotes] = useState(getQueryParam("notes"));
  const [contactId, setContactId] = useState(getQueryParam("contactId"));
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });
  const [isContactEditOpen, setIsContactEditOpen] = useState(false);

  const [clientDetails, setClientDetails] = useState<Client | ClientRequest>({
    name: "",
    contactId: parseInt(contactId),
    note: "",
    kycDetails: [
      { kycType: KYCTypes.AADHAAR, value: getQueryParam("AADHAAR") },
      { kycType: KYCTypes.PAN, value: getQueryParam("PAN") },
      { kycType: KYCTypes.GST, value: getQueryParam("GST") },
    ],
  });

  const fetchContacts = async (searchString: string = "") => {
    const contacts = await contactService.getContacts(searchString, false);
    if (contactId && contacts) {
      const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
      setContactList([contact, validContacts].flat());
      return;
    }
    if (contacts) setContactList(contacts);
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        const fetchedContact = await contactService.getContact(parseInt(contactId));
        setContact(fetchedContact);
        setContactList([fetchedContact]);
      }
    };
    fetchContactById();
  }, [contactId]);

  const { error, validate } = useInputValidate({ name, contactId });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const validKycDetails = clientDetails.kycDetails.filter((item) => item.value);

  const isAddDisabled = [KYCTypes.AADHAAR, KYCTypes.PAN, KYCTypes.GST].every(
    (type) => clientDetails.kycDetails.some((item) => item.kycType === type && item.value)
  );

  const handleContactChange = (value: string) => setContactId(value);

  const redirectUrl = ClientsUrls.create;
  const redirectParams = new URLSearchParams({ notes, redirect: queryStringRedirectUrl });
  if (validKycDetails) validKycDetails.forEach((item) => redirectParams.append(item.kycType, item.value));

  const handleContactCreate = (searchString: string) => {
    const contactCreateParams = new URLSearchParams({ name: searchString, redirect: `${redirectUrl}?${redirectParams.toString()}` });
    navigate(`${ContactsUrls.create}?${contactCreateParams}`);
  };

  const handleContactEdit = () => {
    const redirectParamsWithContactId = new URLSearchParams(redirectParams);
    redirectParamsWithContactId.append('name', name);
    redirectParamsWithContactId.append('contactId', contactId);
    const contactEditParams = new URLSearchParams({ redirect: `${redirectUrl}?${redirectParamsWithContactId.toString()}` });
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?${contactEditParams.toString()}`);
    setIsContactEditOpen(false);
  };

  const handleSubmission = async () => {
    if (validate()) {
      const client = { name, note: notes, contactId: parseInt(contactId), kycDetails: validKycDetails };
      const response = await clientService.createClient(client);
      if (queryStringRedirectUrl) {
        navigate(`${queryStringRedirectUrl}&clientId=${response.id}`);
        return;
      }
      navigate(ClientsUrls.list);
    }
  };

  const handleCancel = () => {
    if (queryStringRedirectUrl) {
      navigate(queryStringRedirectUrl);
      return;
    }
    navigate(ClientsUrls.list);
  };

  return {
    name,
    setName,
    notes,
    setNotes,
    clientDetails,
    setClientDetails,
    error,
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
    handleContactEdit,
    handleCancel,
    isContactEditOpen,
    setIsContactEditOpen,
  };
};

export { useClientCreation };