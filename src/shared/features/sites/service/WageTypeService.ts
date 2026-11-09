import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import type { WageType } from "@/shared/features/workers/DTOs/WorkerProps";

const useWageTypeService = () => {
  const baseUrl = import.meta.env.VITE_WORKER_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getWageTypes = async (searchString: string = "") => {
    const { data } = await apiHelper.get<WageType[]>(`wage-types?searchString=${searchString}`);
    return data;
  };

  return { getWageTypes };
};

export { useWageTypeService };