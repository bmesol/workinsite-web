import type { UpiEditDeleteButtonsProp } from "../DTOs/DTOs";

const useUpiEditDeleteButtons = (props: UpiEditDeleteButtonsProp) => {
  const { details, setDetails } = props;

  const handleDelete = (id: number) => {
    const filteredUpiDetails = details.upiDetails?.filter((_, index) => index !== id) ?? [];
    setDetails({ upiDetails: filteredUpiDetails });
  };

  return { handleDelete };
};

export { useUpiEditDeleteButtons };