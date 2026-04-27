import type {BankAccountProps, UpiDetail} from '@/shared/features/suppliers/DTOs/SupplierProps';
import type {WorkerCategoryProps} from './WorkerCategoryProps';
import type {KYCDetail} from '@/shared/features/clients/DTOs/ClientProps';
import type {Contact} from '@/shared/features/contacts/DTOs/ContactProps';
 
const GenderTypes = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;

type GenderTypes = typeof GenderTypes[keyof typeof GenderTypes];
 
interface WorkerBase {
  name: string;
  gender: GenderTypes;
  dateOfBirth: string;
  kycDetails: KYCDetail[];
  bankAccounts: BankAccountProps[];
  upiDetails: UpiDetail[];
  note: string;
  isActive?: boolean;
}
 
interface WorkerRequest extends WorkerBase {
  contactId: number;
  workerCategoryId: number;
}
 
interface Worker extends WorkerBase {
  id: number;
  contact: Contact;
  workerCategory: WorkerCategoryProps;
}
 
interface WageType {
  id: number;
  name: string;
}
 
export {GenderTypes};
export type {WorkerRequest, Worker, WageType};