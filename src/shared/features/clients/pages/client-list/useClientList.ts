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
  const [loading, setLoading] = useState(true);           
  const [searchLoading, setSearchLoading] = useState(false); 
  const [deleteId, setDeleteId] = useState<number | null>(null); 

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const clientData = await clientService.getClients("");
        setClientDetails(clientData);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const fetchClient = async (searchString: string = "") => {
    setSearchLoading(true);
    try {
      const clientData = await clientService.getClients(searchString);
      setHasSearchFilter(searchString !== "");
      setClientDetails(clientData);
    } finally {
      setSearchLoading(false);
    }
  };

  const refreshList = async () => {
    const clientData = await clientService.getClients("");
    setClientDetails(clientData);
  };

  const handleClientSelect = (id: number) => navigate(ClientsUrls.edit(id));

  const confirmDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeleteId(id);
  };

  const handleClientDelete = async (id: number) => {
    await clientService.deleteClient(id);
    setDeleteId(null);
    refreshList(); 
  };

  return {
    clientDetails,
    fetchClient,
    handleClientSelect,
    confirmDelete,
    handleClientDelete,
    hasSearchFilter,
    loading,
    searchLoading,
    deleteId,
    setDeleteId,
  };
};

export { useClientList };