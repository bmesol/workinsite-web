import supplierCreationIllustration from "@/assets/images/supplier-creation-illustration.png";
import { GetStartedCard } from "@/shared/components/GetStartedCard/GetStartedCard";
import { SuppliersUrls } from "../../utils/urls";

const SupplierGetStartedPage = () => {
  return (
    <GetStartedCard imgSrc={supplierCreationIllustration} buttonLabel="New Supplier" buttonClick={SuppliersUrls.create}>
      Effortlessly manage your suppliers and streamline your construction project supply chain with WorkInsite. Get started today and optimize your procurement process.
    </GetStartedCard>
  );
};

export { SupplierGetStartedPage };
