import workerCreationIllustration from "@/assets/images/worker-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { WorkersUrls } from "../../utils/urls";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const WorkerGetStartedPage = () => {
  const { t } = useLanguage();
  return (
    <GetStartedCard imgSrc={workerCreationIllustration} buttonLabel={t('Create Worker')} buttonClick={WorkersUrls.create}>
      {t('Simplify the management of your construction workers with WorkInSite. Get started today to ensure seamless coordination and productivity on your projects.')}
    </GetStartedCard>
  );
};

export { WorkerGetStartedPage };
