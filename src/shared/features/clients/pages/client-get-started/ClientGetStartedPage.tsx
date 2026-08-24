import clientCreationIllustration from "@/assets/images/client-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ClientsUrls } from "../../utils/urls";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ClientGetStartedPage = () => {
  const { t } = useLanguage();
  return (
    <GetStartedCard imgSrc={clientCreationIllustration} buttonLabel={t('Create Client')} buttonClick={ClientsUrls.create}>
      {t('With WorkInSite, managing clients is simple and efficient. Start organizing your client relationships today to enhance communication and collaboration.')}
    </GetStartedCard>
  );
};

export { ClientGetStartedPage };
