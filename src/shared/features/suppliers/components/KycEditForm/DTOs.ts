import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { KYCTypes } from "../../../clients/DTOs/ClientProps";

interface KycEditFormProps extends SupplierDetailsType {
  selectedItem: { id: number, type: KYCTypes, value: string };
}

export type { KycEditFormProps };
