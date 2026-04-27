import { useSiteService } from "../../service/SiteService";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import type { Site } from "../../DTOs/SiteProps";
import { useEffect, useState } from "react";

const useSiteList = () => {
  const navigate = useNavigate();
  const siteService = useSiteService();
  const [siteDetails, setSiteDetails] = useState<Site[]>([]);
  const [hasSearchFilter, setHasSearchFilter] = useState<boolean>(false);

  const fetchSite = async (searchString: string = "") => {
    const siteData = await siteService.getSites(searchString);
    setHasSearchFilter(!!searchString);  // 👈 true/false in one line
    if (siteData) setSiteDetails(siteData);  // 👈 null guard
  };

  useEffect(() => { fetchSite(); }, []);

  const handleSiteSelect = (id: number) => navigate(SitesUrls.edit(id));

  return { siteDetails, fetchSite, handleSiteSelect, hasSearchFilter };
};

export { useSiteList };
