import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { Worker } from '@/shared/features/workers/DTOs/WorkerProps';
import { useWorkerService } from '@/shared/features/workers/service/WorkerService';
import { useWorkerTransactionService } from '../../service/WorkerTransactionService';
import { useWorkerInputValidate } from '../../components/InputValidate/WorkerTransactionInputValidate';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';
import { WorkerTransactionUrls } from '../../utils/urls';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

const useWorkerTransactionCreation = () => {
  const navigate = useNavigate();
  const workerService = useWorkerService();
  const workerTransactionService = useWorkerTransactionService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [workerId, setWorkerId] = useState('');
  const [workerList, setWorkerList] = useState<Worker[]>([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(formatted);
  const [remark, setRemark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useWorkerInputValidate({
    workerId,
    date,
    amount,
    paymentMethod,
  });

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setWorkerId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

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
      amount.trim() !== '' ||
      remark.trim() !== '' ||
      workerId !== '' ||
      date !== formatted ||
      paymentMethod !== PaymentMethodEnum.CASH
    );
  }, [amount, remark, workerId, date, paymentMethod]);

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

      await workerTransactionService.createWorkerTransaction(payload);
      resetFormFields();
      navigate(WorkerTransactionUrls.list);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Create Worker Transaction';
      toast.error(errorMsg);
    }
  };

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
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useWorkerTransactionCreation };