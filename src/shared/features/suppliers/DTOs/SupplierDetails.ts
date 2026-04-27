import type { Supplier, SupplierRequest } from "./SupplierProps";

interface SupplierDetailsType {
  supplierDetails: SupplierRequest | Supplier;
  setSupplierDetails: React.Dispatch<React.SetStateAction<SupplierRequest | Supplier>>;
}

export type { SupplierDetailsType };