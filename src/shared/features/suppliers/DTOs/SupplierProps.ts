import type { KYCDetail } from "@/shared/features/clients/DTOs/ClientProps";
import type { Contact } from "@/shared/features/contacts/DTOs/ContactProps";

const UpiTypes = {
  GPAY: "GPAY",
  PHONEPE: "PHONEPE",
  UPI_ID: "UPI_ID",
} as const;

type UpiTypes = typeof UpiTypes[keyof typeof UpiTypes];

interface UpiDetail {
  upiType: UpiTypes;
  value: string;
}

interface BankAccountProps {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
}

interface SupplierBase {
  name: string;
  note: string;
  isActive?: boolean;
  kycDetails: KYCDetail[];
  bankAccounts: BankAccountProps[];
  upiDetails: UpiDetail[];
}

interface SupplierRequest extends SupplierBase {
  contactId: number;
}

interface Supplier extends SupplierBase {
  id: number;
  contact: Contact;
}

export { UpiTypes };                                    // export the value
export type { SupplierRequest, Supplier, UpiDetail, BankAccountProps }; // export types
