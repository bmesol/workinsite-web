import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWorkerTransactionService } from '../../service/WorkerTransactionService';
import { useWorkerInputValidate } from '../../components/InputValidate/WorkerTransactionInputValidate';
import type { WorkerTransactionProps } from '../../DTOs/WorkerTransaction';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';
import { WorkerTransactionUrls } from '../../utils/urls';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

const useWorkerTransactionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const workerService = useWorkerService();
  const workerTransactionService = useWorkerTransactionService();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [workerTransaction, setWorkerTransaction] = useState<WorkerTransactionProps>();
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const today = new Date();
  const formatted = formatDateToString(today);

  const { error, validate, setError, initialError } = useWorkerInputValidate({
    workerId,
    date,
    amount,
    paymentMethod,
  });

const fetchWorkers = async (WorkerName: string = '') => {
  const workers = await workerService.getWorkers({ WorkerName });
  if (!workers) return;
  setWorkerList(WorkerName ? workers.slice(0, 3) : workers);
};
  const workerDetails = workerList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSelect = (id: string) => {
    setPaymentMethod(id as PaymentMethodType);
  };

  const hasUnsavedChanges = useCallback(() => {
    return (
      amount.trim() !== workerTransaction?.amount ||
      remark.trim() !== workerTransaction?.remark ||
      workerId.trim() !== workerTransaction?.worker.id.toString() ||
      date !== workerTransaction?.date ||
      paymentMethod !== workerTransaction?.paymentMethod
    );
  }, [amount, remark, workerId, date, paymentMethod, workerTransaction]);

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setWorkerId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(WorkerTransactionUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        workerId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      };

      await workerTransactionService.updateWorkerTransaction(
        parseInt(id!),
        payload,
      );
      resetFormFields();
      navigate(WorkerTransactionUrls.list);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Edit Worker Transaction';
      toast.error(errorMsg);
    }
  };

  const fetchWorkerTransaction = async () => {
    setLoading(true);
    try {
      const data: WorkerTransactionProps =
        await workerTransactionService.getWorkerTransaction(parseInt(id!));
      setAmount(data.amount);
      setDate(data.date);
      setWorkerId(data.worker.id.toString());
      setPaymentMethod(data.paymentMethod);
      setRemark(data.remark);
      setWorkerList([data.worker]);
      setWorkerTransaction(data);
    } catch (error) {
      console.error('WorkerTransactionEdit: fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerTransaction();
  }, [id]);

  return {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    workerId, setWorkerId,
    fetchWorkers,
    workerDetails,
    paymentMethod,
    error,
    loading,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useWorkerTransactionEdit };