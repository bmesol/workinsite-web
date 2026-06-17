import type { Client } from '@/shared/features/clients/DTOs/ClientProps';

const PaymentMethodEnum = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  BANK_TRANSFER: 'Bank_Transfer',
  UPI: 'UPI',
} as const;

type PaymentMethodEnum = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

interface ClientTransactionRequest {
  clientId: string;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
}

interface ClientTransactionProps {
  client: Client;
  date: string;
  amount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
}

export { PaymentMethodEnum };
export type { ClientTransactionRequest, ClientTransactionProps };