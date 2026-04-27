import { SiteGetStartedPage } from "../site-get-started/SiteGetStartedPage";
import { Actions, Header } from "@/shared/components/Header/Header";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SiteCard } from "../../components/SiteCard/SiteCard";
import { useNavigate } from "react-router-dom";
import { SitesUrls } from "../../utils/urls";
import { useSiteList } from "./useSiteList";

const SiteListPage = () => {
  const navigate = useNavigate();
  const { siteDetails, fetchSite, handleSiteSelect, hasSearchFilter } = useSiteList();

  if (!siteDetails.length && !hasSearchFilter) return <SiteGetStartedPage />;

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <Header title="Sites">
        <Actions>
          <Button onClick={() => navigate(SitesUrls.create)}>
            Create Site
          </Button>
        </Actions>
      </Header>

      {/* Search */}
      <div className="flex justify-end mt-4 mb-4">
        <Input
          className="w-full sm:w-72"
          placeholder="Search sites..."
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
              fetchSite(value);
            }
          }}
        />
      </div>

      {/* Site Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
        {!siteDetails.length ? (
          <div className="col-span-2 my-4 text-center text-sm text-muted-foreground">
            No sites found
          </div>
        ) : (
          siteDetails.map((site) => (
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