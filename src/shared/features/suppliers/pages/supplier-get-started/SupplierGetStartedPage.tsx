import supplierCreationIllustration from "@/assets/images/supplier-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { SuppliersUrls } from "../../utils/urls";
import { useLanguage } from '@/shared/hooks/useLanguageContext';

const SupplierGetStartedPage = () => {
  const { t } = useLanguage();
  return (
    <GetStartedCard imgSrc={supplierCreationIllustration} buttonLabel={t('New Supplier')} buttonClick={SuppliersUrls.create}>
      Effortlessly manage your suppliers and streamline your construction project supply chain with WorkInsite. Get started today and optimize your procurement process.
    </GetStartedCard>
  );
};

export { SupplierGetStartedPage };
