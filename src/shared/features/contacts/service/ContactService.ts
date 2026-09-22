import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type  { ContactRequest } from "@/shared/features/contacts/DTOs/ContactProps";

const useContactService = () => {
  const baseUrl = import.meta.env.VITE_MASTER_DATA_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getContacts = async (searchString: string = "", setIsLoading?: boolean) => {
    const { data } = await apiHelper.get(`contacts?searchString=${searchString}`, setIsLoading);
    return data;
  };

  const getContact = async (id: number) => {
    const { data } = await apiHelper.get(`contacts/${id}`);
    return data;
  };

  const createContact = async (contact: ContactRequest) => {
    const { data } = await apiHelper.post("contacts", contact);
    return data;
  };

  const updateContact = async (id: number, contact: ContactRequest) => {
    await apiHelper.put(`contacts/${id}`, contact);
  };

  const deleteContact = async (id: number) => {
    await apiHelper.delete(`contacts/${id}`);
  };

  return { getContacts, getContact, createContact, updateContact, deleteContact };
};

export { useContactService };
