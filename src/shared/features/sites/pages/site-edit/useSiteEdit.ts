import { useContactValidate } from "../../../clients/components/ContactValidate/ContactValidate";
import { useSiteInputValidate } from "../../components/InputValidate/SiteInputValidate";
import { useContactService } from "@/shared/features/contacts/service/ContactService";
import { useClientService } from "@/shared/features/clients/service/ClientService";
import type { Contact } from "../../../contacts/DTOs/ContactProps";
import { ContactsUrls } from "../../../contacts/utils/urls";
import { useSiteService } from "@/shared/features/sites/service/SiteService";
import type { Client } from "../../../clients/DTOs/ClientProps";
import { ClientsUrls } from "../../../clients/utils/urls";
import type { Site } from "../../DTOs/SiteProps";
import { SiteStatus } from "../../DTOs/SiteProps";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useSiteEdit = (id: string, queryString: URLSearchParams) => {
  const navigate = useNavigate();

  // shadcn dialog open state — replaces useModel()
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const model = {
    open: () => setIsDialogOpen(true),
    close: () => setIsDialogOpen(false),
  };

  const clientService = useClientService();
  const contactService = useContactService();
  const siteService = useSiteService();

  const getQueryParam = (param: string) => queryString.get(param)?.trim() || "";

  const newName = getQueryParam("siteName");
  const newClientId = getQueryParam("clientId");
  const newGoogleLocation = getQueryParam("googleLocation");
  const newNotes = getQueryParam("notes");
  const newContactId = getQueryParam("contactId");
  const newSupervisorIds = queryString.get("supervisorIds") || "[]";
  const validSupervisorIds = JSON.parse(newSupervisorIds);
  const newStatus = getQueryParam("status");

  const [name, setName] = useState(newName);
  const [clientId, setClientId] = useState(newClientId);
  const [googleLocation, setGoogleLocation] = useState(newGoogleLocation);
  const [notes, setNotes] = useState(newNotes);
  const [contactId, setContactId] = useState(newContactId);
  const [supervisorIds, setSupervisorIds] = useState<number[]>(validSupervisorIds);
  const [status, setStatus] = useState(newStatus);

  const [clientList, setClientList] = useState<Client[]>([]);
  const [client, setClient] = useState<Client>();
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [contact, setContact] = useState<Contact>({ id: 0, name: "", contactDetails: [] });
  const [wageTypeId, setWageTypeId] = useState("");

  const [siteDetails, setSiteDetails] = useState<Site>();

  const fetchSite = async () => {
    const siteData: Site = await siteService.getSite(parseInt(id));
    setSiteDetails(siteData);
    if (!newName) setName(siteData.name);
    if (!newClientId) setClientId(siteData.client.id.toString());
    if (!newGoogleLocation) setGoogleLocation(siteData.googleLocation);
    if (!newNotes) setNotes(siteData.note);
    if (!newContactId) setContactId(siteData.contact.id.toString());
   if (validSupervisorIds.length === 0)
  setSupervisorIds(siteData.supervisors?.map((supervisor) => supervisor.id) ?? []);
    if (!newStatus) setStatus(siteData.status);
    setWageTypeId(siteData.wageType.id.toString());
  };

  useEffect(() => { fetchSite(); }, []);

  const fetchClients = async (searchString: string = "") => {
    if (searchString) {
      const clients = await clientService.getClients(searchString, false);
      if (clientId && clients) {
        const validClients = clients.filter((item: Client) => item.id !== parseInt(clientId));
        setClientList([client, validClients.slice(0, 3)].flat());
        return;
      }
      if (clients) setClientList(clients.slice(0, 3));
    }
  };

  useEffect(() => {
    const fetchClientById = async () => {
      if (clientId) {
        const client = await clientService.getClient(parseInt(clientId));
        setClient(client);
        setClientList([client]);
      }
    };
    fetchClientById();
  }, [clientId]);

  const fetchContacts = async (searchString: string = "") => {
    if (searchString) {
      const contacts = await contactService.getContacts(searchString, false);
      if (contactId && contacts) {
        const validContacts = contacts.filter((item: Contact) => item.id !== parseInt(contactId));
        setContactList([contact, validContacts.slice(0, 3)].flat());
        return;
      }
      if (contacts) setContactList(contacts.slice(0, 3));
    }
  };

  useEffect(() => {
    const fetchContactById = async () => {
      if (contactId) {
        const contact = await contactService.getContact(parseInt(contactId));
        setContact(contact);
        setContactList([contact]);
      }
    };
    fetchContactById();
  }, [contactId]);

  const { error, validate } = useSiteInputValidate({ name, clientId, googleLocation, contactId });
  const { primaryContactDetails, hasMoreDetails } = useContactValidate(contact);

  const clientDetails = clientList.map((item) => ({ label: item.name, value: item.id.toString() }));
  const contactDetails = contactList.map((item) => ({ label: item.name, value: item.id.toString() }));
const siteStatus = [
  { label: "Yet To Start", value: SiteStatus.YET_TO_START },
  { label: "Working", value: SiteStatus.WORKING },
  { label: "Hold", value: SiteStatus.HOLD },  
  { label: "Completed", value: SiteStatus.COMPLETED },
];
  const handleClientChange = (value: string) => setClientId(value);
  const handleContactChange = (value: string) => setContactId(value);

  const redirectUrl = SitesUrls.edit(parseInt(id));
  const redirectParams = new URLSearchParams({
    siteName: name,
    clientId,
    googleLocation,
    notes,
    contactId,
    supervisorIds: `[${supervisorIds.toString()}]`,
    status,
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
    model.close();
  };

  const handleSubmission = async () => {
    if (validate()) {
      if (supervisorIds.length === 0) {
        // replaces toast.error() from bmes-components
        toast.error("Please add at least one supervisor.");
      } else {
        const site = {
          name,
          clientId: parseInt(clientId),
          googleLocation,
          note: notes,
          contactId: parseInt(contactId),
          supervisorIds,
          status,
          wageTypeId: parseInt(wageTypeId), 
        };
        await siteService.updateSite(parseInt(id), site);
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
    status,
    setStatus,
    siteStatus,
    model,
    isDialogOpen,
    setIsDialogOpen,
    redirectUrl,
    redirectParams,
    siteDetails,
  };
};

export { useSiteEdit };