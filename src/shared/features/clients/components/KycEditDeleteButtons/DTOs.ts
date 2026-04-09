import type { ClientDetailsType } from "../../DTOs/ClientDetails";
import type { KYCDetail } from "../../DTOs/ClientProps";

interface ClientEditDeleteButtonsProps extends ClientDetailsType {
  selectedItem: { id: number, item: KYCDetail };
}

export type { ClientEditDeleteButtonsProps };
