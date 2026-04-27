import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";
import { UpiTypes } from "../../DTOs/SupplierProps";

interface UpiEditFormProps extends SupplierDetailsType {
  selectedItem: { id: number, type: UpiTypes, value: string };
}

export type { UpiEditFormProps };
