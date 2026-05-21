import type { KYCDetail, KycTypesProps } from "../DTOs/DTOs";

interface KycEditDeleteButtonsProps extends KycTypesProps {
  selectedItem: { id: number; item: KYCDetail };
}

export type { KycEditDeleteButtonsProps };