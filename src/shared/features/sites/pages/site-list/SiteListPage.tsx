import { SiteGetStartedPage } from "../site-get-started/SiteGetStartedPage";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { SiteCard } from "../../components/SiteCard/SiteCard";
import { SiteCardSkeleton } from "../../components/SiteCard/SiteCardSkeleton";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { useSiteList } from "./useSiteList";
import { SearchBar } from "@/shared/components/SearchBar/SearchBar";
import { SearchBarSkeleton } from "@/shared/components/SearchBar/SearchBarSkeleton";
import { useState } from "react";
import { useLanguage } from '@/shared/hooks/useLanguageContext';
import { usePermission } from '@/shared/hooks/usePermission';
import { SiteStatusLegend } from "../../components/SiteStatusLegend/SiteStatusLegend";
import { ListPageHeaderSkeleton } from "@/shared/components/Header/ListPageHeaderSkeleton";
const SiteListPage = () => {
  const { t } = useLanguage();
  const { canEdit } = usePermission();
  const editable = canEdit('Sites');
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

  if (!siteDetails.length && !hasSearchFilter && !loading) return <SiteGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      {loading ? (
        <ListPageHeaderSkeleton buttonWidths={["w-9", "w-28"]} />
      ) : (
        <Header title={t('Site List')}>
          <Actions>
            <SiteStatusLegend />
            <Button onClick={() => navigate(SitesUrls.create)} disabled={!editable}>
              {t('Create Site')}
            </Button>
          </Actions>
        </Header>
      )}

      {/* SearchBar */}
      <div className="flex justify-end mt-4 mb-4">
        <div className="w-full md:w-3/12">
          {loading ? <SearchBarSkeleton /> : (
            <SearchBar
              searchText={searchValue}
              setSearchText={(val) => { setSearchValue(val); fetchSite(val); }}
              searchCategory={t('Search sites')}
              allowAllCharacters={true}
            />
          )}
        </div>
      </div>

      {/* Site Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SiteCardSkeleton key={i} />
          ))
        ) : !filteredSiteList.length ? (
          <div className="col-span-full flex w-full flex-col items-center justify-center py-16 px-4">
            <p className="text-center text-muted-foreground text-sm break-words">{t('No sites found')}</p>
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
