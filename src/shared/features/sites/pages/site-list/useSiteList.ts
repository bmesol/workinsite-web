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
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const siteData = await siteService.getSites({});  // ✅ empty object
        setSiteDetails(siteData ?? []);  // ✅ undefined safe
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const fetchSite = async (searchString: string = "") => {
    setSearchLoading(true);
    try {
      const siteData = await siteService.getSites(
        searchString ? { searchString } : {}  // ✅ empty string-ஆ இருந்தா {} pass
      );
      setHasSearchFilter(searchString !== "");
      setSiteDetails(siteData ?? []);  // ✅ undefined safe
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSiteSelect = (id: number) => navigate(SitesUrls.edit(id));

  return {
    siteDetails,
    fetchSite,
    handleSiteSelect,
    hasSearchFilter,
    loading,
    searchLoading,
  };
};

export { useSiteList };