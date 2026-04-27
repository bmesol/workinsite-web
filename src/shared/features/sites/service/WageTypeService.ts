import { useAPIHelper } from "@/shared/helpers/ApiHelper";

const useWageTypeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWageTypes = async (searchString: string = "") => {
    const response = await apiHelper.get(`wage-types?searchString=${searchString}`);
    return response.data;
  };

  return { getWageTypes };
};

export { useWageTypeService };