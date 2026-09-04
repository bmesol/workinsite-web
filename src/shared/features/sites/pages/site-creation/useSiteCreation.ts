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
import { SiteStatus } from "../../DTOs/SiteProps";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [status, setStatus] = useState(getQueryParam("status") || SiteStatus.YET_TO_START);
  const [wageTypeId, setWageTypeId] = useState(getQueryParam("wageTypeId")); // 👈
  const [wageTypeList, setWageTypeList] = useState<WageType[]>([]);           // 👈

  const [clientList, setClientList] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });

  const fetchClients = async (searchString: string = "") => {
    const clients = await clientService.getClients(searchString);
    if (!clients) return;
    if (clientId) {
      const validClients = clients.filter((item: Client) => item.id !== parseInt(clientId));
      setClientList([client, ...validClients].filter(Boolean) as Client[]);
      return;
    }
    setClientList(clients);
  };

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
    const contacts = await contactService.getContacts(searchString);
    if (!contacts) return;
    if (contactId) {
      const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
      setContactList([contact, ...validContacts].filter(Boolean) as Contact[]);
      return;
    }
    setContactList(contacts);
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

  const { error, validate } = useSiteInputValidate({ name, clientId, googleLocation, contactId, wageTypeId });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact, true);

  const clientDetails = clientList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const wageTypeDetails = wageTypeList.map((item) => ({ label: item.name, value: item.id.toString() })); // 👈

  const siteStatus = [
    { label: "Yet To Start", value: SiteStatus.YET_TO_START },
    { label: "Working", value: SiteStatus.WORKING },
    { label: "Hold", value: SiteStatus.HOLD },
    { label: "Completed", value: SiteStatus.COMPLETED },
  ];

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
    status,
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
      const site = {
        name,
        clientId: parseInt(clientId),
        googleLocation,
        note: notes,
        contactId: parseInt(contactId),
        supervisorIds,
        status,
        wageTypeId: parseInt(wageTypeId), // 👈
      };
      try {
        await siteService.createSite(site);
        navigate(SitesUrls.list);
      } catch (error: any) {
        toast.error(error?.response?.data?.[0]?.message || 'Site already exists');
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
    status,
    setStatus,
    siteStatus,
    redirectUrl,
    redirectParams,
    wageTypeId,       // 👈
    setWageTypeId,    // 👈
    wageTypeDetails,  // 👈
    fetchWageTypes,   // 👈
  };
};

export { useSiteCreation };