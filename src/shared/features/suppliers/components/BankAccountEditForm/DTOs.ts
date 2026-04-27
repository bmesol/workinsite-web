import type { SupplierDetailsType } from "../../DTOs/SupplierDetails";

interface BankAccountEditFormProps extends SupplierDetailsType {
  selectedItem: { id: number, accountName: string, accountNumber: string, ifscCode: string };
}

export type { BankAccountEditFormProps };
