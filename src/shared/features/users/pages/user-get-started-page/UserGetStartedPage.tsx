import userCreationIllustration from "@/assets/images/user-creation-illustration.svg";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { UsersUrls } from "../../utils/urls";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const UserGetStartedPage = () => {
  const { t } = useLanguage();
  return (
    <GetStartedCard imgSrc={userCreationIllustration} buttonLabel={t('Create User')} buttonClick={UsersUrls.create}>
      With WorkInSite, managing your team of Engineers and supervisors is
      streamlined and efficient. Get started today and take control of user
      management with ease.
    </GetStartedCard>
  );
};

export { UserGetStartedPage };