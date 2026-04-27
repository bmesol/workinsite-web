import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import type { UpiDetail } from "../../DTOs/SupplierProps";

interface UpiEditDeleteButtonsProp extends SupplierDetailsType {
  selectedItem: { id: number, item: UpiDetail };
}

export type{ UpiEditDeleteButtonsProp };