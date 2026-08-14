import type { Client } from '@/shared/features/clients/DTOs/ClientProps';

const PaymentMethodEnum = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  BANK_TRANSFER: 'Bank_Transfer',
  UPI: 'UPI',
} as const;

type PaymentMethodEnum = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

interface ClientTransactionSplitRequest {
  siteId: number;
  amount: string;
}

interface ClientTransactionRequest {
  clientId: string;
  date: string;
  totalAmount: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  clientTransactionSplits: ClientTransactionSplitRequest[];
}

interface ClientTransactionSplitProps {
  site: { id: number; name: string };
  amount: string;
}

interface ClientTransactionProps {
  client: Client;
  date: string;
  amount: string;
  totalAmount?: string;
  paymentMethod: PaymentMethodEnum;
  remark: string;
  id: number;
  clientTransactionSplits?: ClientTransactionSplitProps[];
}

export { PaymentMethodEnum };
export type { ClientTransactionRequest, ClientTransactionSplitRequest, ClientTransactionProps, ClientTransactionSplitProps };