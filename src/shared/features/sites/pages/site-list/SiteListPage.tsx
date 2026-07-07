import { SiteGetStartedPage } from "../site-get-started/SiteGetStartedPage";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { SiteCard } from "../../components/SiteCard/SiteCard";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { useSiteList } from "./useSiteList";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SiteListPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const {
    siteDetails,
    fetchSite,
    handleSiteSelect,
    hasSearchFilter,
    loading,
  } = useSiteList();

  const filteredSiteList = siteDetails.filter((site) =>
    site.name.toLowerCase().includes(searchValue.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (!siteDetails.length && !hasSearchFilter) return <SiteGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <Header title={t('Site List')}>
        <Actions>
          <Button onClick={() => navigate(SitesUrls.create)}>
            {t('Create Site')}
          </Button>
        </Actions>
      </Header>

      {/* SearchBar */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          <SearchBar
            searchText={searchValue}
            setSearchText={setSearchValue}
            searchCategory={t('Search sites')}
            allowAllCharacters={true}
          />
        </div>
      </div>

      {/* Site Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {!filteredSiteList.length ? (
          <div className="col-span-2 my-4 text-center text-sm text-muted-foreground">
            {t('No sites found')}
          </div>
        ) : (
          filteredSiteList.map((site) => (
            <div
              key={site.id}
              onClick={() => handleSiteSelect(site.id)}
              className="cursor-pointer w-full"
            >
              <SiteCard site={site} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { SiteListPage };
