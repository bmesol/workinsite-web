import type { SiteCreationRequest, SiteUpdationRequest } from "../DTOs/SiteProps";
import { useAPIHelper } from "@/shared/helpers/ApiHelper";
import { buildQueryParams } from '@/shared/utils/buildQueryParams';

type GetSitesParams = {
  searchString?: string;
  status?: string;
};

const useSiteService = () => {
  const baseUrl = import.meta.env.VITE_SITE_SERVICE_BASE_URL || "";
  const apiHelper = useAPIHelper(baseUrl, true);

  const getSites = async (params: GetSitesParams = {}) => {
    const { data } = await apiHelper.get(`sites?${buildQueryParams({
      searchString: params.searchString,
      status: params.status,
    })}`);
    return data;
  };

  const getSite = async (id: number) => {
    const { data } = await apiHelper.get(`sites/${id}`);
    return data;
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