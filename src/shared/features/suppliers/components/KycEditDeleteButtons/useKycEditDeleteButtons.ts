import type { KycEditDeleteButtonsProp } from "./DTOs";

const useKycEditDeleteButtons = (props: KycEditDeleteButtonsProp) => {
  const { supplierDetails, setSupplierDetails } = props;

  const handleDelete = (id: number) => {
    const filteredKycDetails = supplierDetails.kycDetails.filter((_, index) => index !== id);
    setSupplierDetails((prev) => ({ ...prev, kycDetails: filteredKycDetails }));
  };

  return { handleDelete };
};

export { useKycEditDeleteButtons };
