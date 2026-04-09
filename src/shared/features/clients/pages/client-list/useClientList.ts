import { useClientService } from "../../service/ClientService";
import type { Client } from "../../DTOs/ClientProps";
import { ClientsUrls } from "../../utils/urls";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const useClientList = () => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const [clientDetails, setClientDetails] = useState<Client[]>([]);

  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

const fetchClient = async (searchString: string = "") => {
  const clientData = await clientService.getClients(searchString);
  console.log("RAW API response:", JSON.stringify(clientData[0], null, 2)); // ✅ full structure
  setClientDetails(clientData);
};

  useEffect(() => { fetchClient() }, []);

  const handleClientSelect = (id: number) => navigate(ClientsUrls.edit(id));

  const handleClientDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await clientService.deleteClient(id);
    window.location.reload();
  };

  return { clientDetails, fetchClient, handleClientSelect, handleClientDelete, hasSearchFilter };
};

export { useClientList };