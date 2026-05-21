import type { KycEditDeleteButtonsProps } from "./DTOs";

const useKycEditDeleteButtons = (props: KycEditDeleteButtonsProps) => {
  const { details, setDetails } = props;

  const handleDelete = (id: number) => {
    const filteredKycDetails = details.kycDetails.filter((_, index) => index !== id);
   setDetails({ kycDetails: filteredKycDetails });
  };

  return { handleDelete };
};

export { useKycEditDeleteButtons };