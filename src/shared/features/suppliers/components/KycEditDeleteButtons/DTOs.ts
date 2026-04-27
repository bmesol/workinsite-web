import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import type { KYCDetail } from "../../../clients/DTOs/ClientProps";

interface KycEditDeleteButtonsProp extends SupplierDetailsType {
  selectedItem: { id: number, item: KYCDetail };
}

export type { KycEditDeleteButtonsProp };
