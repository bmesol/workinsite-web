import { useListItemDelete } from "@/shared/hooks/useListItemDelete";
import type { KycEditDeleteButtonsProps } from "./DTOs";

const useKycEditDeleteButtons = (props: KycEditDeleteButtonsProps) => {
  const { details, setDetails } = props;
  const { handleDelete } = useListItemDelete(
    details.kycDetails,
    (filtered) => setDetails({ kycDetails: filtered })
  );
  return { handleDelete };
};

export { useKycEditDeleteButtons };
