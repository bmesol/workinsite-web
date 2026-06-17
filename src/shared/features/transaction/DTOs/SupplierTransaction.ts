import type { Supplier } from "@/shared/features/suppliers/DTOs/SupplierProps";
import { PaymentMethodEnum } from "../DTOs/ClientTransaction";

interface SupplierTransactionRequest {
  supplierId: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
}

interface SupplierTransactionProps {
  supplier: Supplier;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
}

export type { SupplierTransactionRequest, SupplierTransactionProps };