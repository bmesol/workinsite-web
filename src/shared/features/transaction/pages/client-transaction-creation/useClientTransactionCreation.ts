import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useClientService } from '@/shared/features/clients/service/ClientService';
import { useClientTransactionService } from '../../service/ClientTransactionService';
import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

import { formatDateToString } from '@/shared/utils/function';
import { ClientTransactionUrls } from '../../utils/urls';
import type { Client } from '@/shared/features/clients/DTOs/ClientProps';

const useClientTransactionCreation = () => {
  const navigate = useNavigate();
  const clientService = useClientService();
  const clientTransactionService = useClientTransactionService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(formatted);
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CASH);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useInputValidate({
    clientId,
    date,
    amount,
    paymentMethod,
  });

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  const fetchClients = async (searchString: string = '') => {
    const clients = await clientService.getClients(searchString, false);
    if (!clients) return;
    setClientList(searchString ? clients.slice(0, 3) : clients);
  };

  const clientDetails = clientList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));


const handleSelect = (id: string) => {
  setPaymentMethod(id as PaymentMethodEnum);
};
  const hasUnsavedChanges = useCallback(() =>
    amount.trim() !== '' ||
    remark.trim() !== '' ||
    clientId !== '' ||
    date !== formatted ||
    paymentMethod !== PaymentMethodEnum.CASH,
  [amount, remark, clientId, date, paymentMethod, formatted]);

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await clientTransactionService.createClientTransaction({
        clientId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      });
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.[0]?.message ||
        err?.response?.data?.message ||
        'Failed to Create Client Transaction.',
      );
    }
  };

  return {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    clientId, setClientId,
    fetchClients,
    clientDetails,
    paymentMethod,
    error,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useClientTransactionCreation };