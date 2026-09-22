import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { ClientRequest } from "../DTOs/ClientProps";

const useClientService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL ?? "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getClients = async (searchString: string = "", setIsLoading?: boolean) => {
    const { data } = await apiHelper.get(`clients?searchString=${searchString}`, setIsLoading);
    return data;
  };

  const getClient = async (id: number) => {
    const { data } = await apiHelper.get(`clients/${id}`);
    return data;
  };

  const createClient = async (client: ClientRequest) => {
    const { data } = await apiHelper.post("clients", client);
    return data;
  };

  const updateClient = async (id: number, client: ClientRequest) => {
    await apiHelper.put(`clients/${id}`, client);
  };

  const deleteClient = async (id: number) => {
    await apiHelper.delete(`clients/${id}`);
  };

  return { getClients, getClient, createClient, updateClient, deleteClient };
};

export { useClientService };