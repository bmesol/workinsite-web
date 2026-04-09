import type { ClientEditDeleteButtonsProps } from "./DTOs";

const useKycEditDeleteButtons = (props: ClientEditDeleteButtonsProps) => {
  const { clientDetails, setClientDetails } = props;

  const handleDelete = (id: number) => {
    const filteredKycDetails = clientDetails.kycDetails.filter((_, index) => index !== id);
    setClientDetails((prev) => ({ ...prev, kycDetails: filteredKycDetails }));
  }

  return { handleDelete };
};

export { useKycEditDeleteButtons };