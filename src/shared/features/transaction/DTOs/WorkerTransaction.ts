import type { Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import type { PaymentMethodEnum } from '../DTOs/ClientTransaction';

interface WorkerTransactionRequest {
  workerId: string;
  date: string;
  amount: string;
  paymentMethod: typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
  remark: string;
}

interface WorkerTransactionProps {
  worker: Worker;
  date: string;
  amount: string;
  paymentMethod: typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
  remark: string;
  id: number;
}

export type { WorkerTransactionRequest, WorkerTransactionProps };