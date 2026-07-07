import contactCreationIllustration from "@/assets/images/contact-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { ContactsUrls } from "../../utils/urls";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const ContactGetStartedPage = () => {
  const { t } = useLanguage();
  return (
    <GetStartedCard
      imgSrc={contactCreationIllustration}
      buttonLabel={t('New Contact')}
      buttonClick={ContactsUrls.create}
    >
      With WorkInSite, managing contacts and facilitating collaboration is easy.
      Start organizing your contacts today to streamline communication.
    </GetStartedCard>
  );
};

export { ContactGetStartedPage };
