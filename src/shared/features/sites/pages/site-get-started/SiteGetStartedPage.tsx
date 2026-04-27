import siteCreationIllustration from "@/assets/images/site-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { SitesUrls } from "../../utils/urls";

const SiteGetStartedPage = () => {
  return (
    <>
      <GetStartedCard imgSrc={siteCreationIllustration} buttonLabel="Create Site" buttonClick={SitesUrls.create}>
        Dive into the heart of construction site management. Create, edit, and
        view site information effortlessly. Assign workers, supervisors and
        track project progress
      </GetStartedCard>
    </>
  );
};

export { SiteGetStartedPage };
