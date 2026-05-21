import type { SiteCreationRequest, SiteUpdationRequest } from "../DTOs/SiteProps";
import { useAPIHelper } from "@/shared/helpers/ApiHelper";

type GetSitesParams = {
  searchString?: string;
  status?: string;
};

const useSiteService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getSites = async (params: GetSitesParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.searchString) queryParams.append('searchString', params.searchString);
    if (params.status)       queryParams.append('status', params.status);
    const response = await apiHelper.get(`sites?${queryParams.toString()}`);
    return response.data;
  };

  const getSite = async (id: number) => {
    const response = await apiHelper.get(`sites/${id}`);
    return response.data;
  };

  const createSite = async (site: SiteCreationRequest) => {
    await apiHelper.post("sites", site);
  };

  const updateSite = async (id: number, site: SiteUpdationRequest) => {
    await apiHelper.put(`sites/${id}`, site);
  };

  const deleteSite = async (id: number) => {
    await apiHelper.delete(`sites/${id}`);
  };

  return { getSites, getSite, createSite, updateSite, deleteSite };
};

export { useSiteService };