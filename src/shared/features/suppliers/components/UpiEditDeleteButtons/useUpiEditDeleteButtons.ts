import type { UpiEditDeleteButtonsProp } from "./DTOs";

const useUpiEditDeleteButtons = (props: UpiEditDeleteButtonsProp) => {
  const { supplierDetails, setSupplierDetails } = props;

  const handleDelete = (id: number) => {
    const filteredUpiDetails = supplierDetails.upiDetails?.filter((_, index) => index !== id) ?? []; 
    setSupplierDetails((prev) => ({ ...prev, upiDetails: filteredUpiDetails }));
  };

  return { handleDelete };
};

export { useUpiEditDeleteButtons };