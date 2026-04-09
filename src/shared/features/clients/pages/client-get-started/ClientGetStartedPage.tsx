import clientCreationIllustration from "@/assets/images/client-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ClientsUrls } from "../../utils/urls";

const ClientGetStartedPage = () => {
  return (
    <GetStartedCard imgSrc={clientCreationIllustration} buttonLabel="Create Client" buttonClick={ClientsUrls.create}>
      With WorkInSite, managing clients is simple and efficient. Start organizing your client relationships today to enhance communication and collaboration.
    </GetStartedCard>
  );
};

export { ClientGetStartedPage };