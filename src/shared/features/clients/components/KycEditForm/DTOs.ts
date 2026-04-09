import type { ClientDetailsType } from "../../DTOs/ClientDetails";
import { KYCTypes } from "../../DTOs/ClientProps";

interface ClientEditFormProps extends ClientDetailsType {
  selectedItem: { id: number, type: KYCTypes, value: string };
}

export type { ClientEditFormProps };
