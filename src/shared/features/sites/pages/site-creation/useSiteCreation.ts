import { useContactValidate } from "../../../clients/components/ContactValidate/ContactValidate";
import { useSiteInputValidate } from "../../components/InputValidate/SiteInputValidate";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import { useClientService } from "@/shared/features/clients/service/ClientService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { useSiteService } from "@/shared/features/sites/service/SiteService";
import { useWageTypeService } from "@/shared/features/sites/service/WageTypeService";
import type { WageType } from "@/shared/features/workers/DTOs/WorkerProps"; 
import type { Client } from "../../../clients/DTOs/ClientProps";
import { ClientsUrls } from "../../../clients/utils/urls";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const useSiteCreation = (queryString: URLSearchParams) => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const contactService = useContactService();
  const siteService = useSiteService();
  const wageTypeService = useWageTypeService();

  const getQueryParam = (param: string) => queryString.get(param)?.trim() || "";
  const initialSupervisorIds = queryString.get("supervisorIds") || "[]";

  const [name, setName] = useState(getQueryParam("siteName"));
  const [clientId, setClientId] = useState(getQueryParam("clientId"));
  const [googleLocation, setGoogleLocation] = useState(getQueryParam("googleLocation"));
  const [notes, setNotes] = useState(getQueryParam("notes"));
  const [contactId, setContactId] = useState(getQueryParam("contactId"));
  const [supervisorIds, setSupervisorIds] = useState<number[]>(JSON.parse(initialSupervisorIds));
  const [wageTypeId, setWageTypeId] = useState(getQueryParam("wageTypeId")); // 👈
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);           // 👈

  const [clientList, setClientList] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });

  const fetchClients = async (searchString: string = "") => {
    if (!searchString) return;
    const clients = await clientService.getClients(searchString);
    if (!clients) return;
    if (clientId) {
      const validClients = clients.filter((item: Client) => item.id !== parseInt(clientId));
      setClientList([client, ...validClients.slice(0, 3)].filter(Boolean) as Client[]);
      return;
    }
    setClientList(clients.slice(0, 3));
  };

  useEffect(() => {
  const loadDefaultWageType = async () => {
    const wageTypes = await wageTypeService.getWageTypes("");
    if (wageTypes && wageTypes.length > 0 && !wageTypeId) {
      setWageTypeId(wageTypes[0].id.toString());
    }
  };
  loadDefaultWageType();
}, []);

  useEffect(() => {
    const fetchClientById = async () => {
      if (clientId) {
        const found = await clientService.getClient(parseInt(clientId));
        setClient(found);
        setClientList([found]);
      }
    };
    fetchClientById();
  }, [clientId]);

  const fetchContacts = async (searchString: string = "") => {
    if (!searchString) return;
    const contacts = await contactService.getContacts(searchString);
    if (!contacts) return;
    if (contactId) {
      const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
      setContactList([contact, ...validContacts.slice(0, 3)].filter(Boolean) as Contact[]);
      return;
    }
    setContactList(contacts.slice(0, 3));
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        const found = await contactService.getContact(parseInt(contactId));
        setContact(found);
        setContactList([found]);
      }
    };
    fetchContactById();
  }, [contactId]);

  // 👇 fetchWageTypes add
  const fetchWageTypes = async (searchString: string = "") => {
    const wageTypes = await wageTypeService.getWageTypes(searchString);
    if (!wageTypes) return;
    setWageTypeList(searchString ? wageTypes.slice(0, 3) : wageTypes);
  };

  const { error, validate } = useSiteInputValidate({ name, clientId, googleLocation, contactId });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const clientDetails = clientList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const wageTypeDetails = wageTypeList.map((item) => ({ label: item.name, value: item.id.toString() })); // 👈

  const handleClientChange = (value: string) => setClientId(value);
  const handleContactChange = (value: string) => setContactId(value);

  const redirectUrl = SitesUrls.create;
  const redirectParams = new URLSearchParams({
    siteName: name,
    clientId,
    googleLocation,
    notes,
    contactId,
    supervisorIds: `[${supervisorIds.toString()}]`,
    wageTypeId, 
  });

  const handleClientCreate = (searchString: string) => {
    redirectParams.delete("clientId");
    const clientCreateParams = new URLSearchParams({
      name: searchString,
      redirect: `${redirectUrl}?${redirectParams.toString()}`,
    });
    navigate(`${ClientsUrls.create}?${clientCreateParams}`);
  };

  const handleContactCreate = (searchString: string) => {
    redirectParams.delete("contactId");
    const contactCreateParams = new URLSearchParams({
      name: searchString,
      redirect: `${redirectUrl}?${redirectParams.toString()}`,
    });
    navigate(`${ContactsUrls.create}?${contactCreateParams}`);
  };

  const handleContactEdit = () => {
    const contactEditParams = new URLSearchParams({
      redirect: `${redirectUrl}?${redirectParams.toString()}`,
    });
    navigate(`${ContactsUrls.edit(parseInt(contactId))}?${contactEditParams.toString()}`);
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (supervisorIds.length === 0) {
        toast.error("Please add at least one supervisor.");
      } else {
        const site = {
          name,
          clientId: parseInt(clientId),
          googleLocation,
          note: notes,
          contactId: parseInt(contactId),
          supervisorIds,
          wageTypeId: parseInt(wageTypeId), // 👈
        };
        await siteService.createSite(site);
        navigate(SitesUrls.list);
      }
    }
  };

  return {
    name,
    setName,
    clientDetails,
    clientId,
    handleClientCreate,
    handleClientChange,
    fetchClients,
    googleLocation,
    setGoogleLocation,
    notes,
    setNotes,
    contact,
    contactId,
    contactDetails,
    fetchContacts,
    handleContactChange,
    handleContactCreate,
    handleContactEdit,
    primaryContactDetails,
    hasMoreDetails,
    error,
    navigate,
    handleSubmission,
    supervisorIds,
    setSupervisorIds,
    redirectUrl,
    redirectParams,
    wageTypeId,       // 👈
    setWageTypeId,    // 👈
    wageTypeDetails,  // 👈
    fetchWageTypes,   // 👈
  };
};

export { useSiteCreation };