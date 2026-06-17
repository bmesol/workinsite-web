import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { Client } from '@/shared/features/clients/DTOs/ClientProps';
import { useClientService } from '@/shared/features/clients/service/ClientService';
import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
import { useClientTransactionService } from '../../service/ClientTransactionService';
import type { ClientTransactionProps } from '../../DTOs/ClientTransaction';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';
import { ClientTransactionUrls } from '../../utils/urls';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

const useClientTransactionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const clientService = useClientService();
  const clientTransactionService = useClientTransactionService();
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientList, setClientList] = useState<Client[]>([]);
 const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [clientTransaction, setClientTransaction] = useState<ClientTransactionProps>();
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false); // ✅ replaces Alert

  const today = new Date();
  const formatted = formatDateToString(today);

  const { error, validate, setError, initialError } = useInputValidate({
    clientId,
    date,
    amount,
    paymentMethod,
  });

  const fetchClients = async (searchString: string = '') => {
    const clients = await clientService.getClients(searchString);
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

  const hasUnsavedChanges = useCallback(() => {
    return (
      amount.trim() !== clientTransaction?.amount ||
      remark.trim() !== clientTransaction?.remark ||
      clientId.trim() !== clientTransaction?.client.id.toString() ||
      date !== clientTransaction?.date ||
      paymentMethod !== clientTransaction?.paymentMethod
    );
  }, [amount, remark, clientId, date, paymentMethod, clientTransaction]);

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setClientId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true); // ✅ opens AlertDialog
    } else {
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        clientId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      };

      await clientTransactionService.updateClientTransaction(
        parseInt(id!),
        payload,
      );
      resetFormFields();
      navigate(ClientTransactionUrls.list);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Edit Client Transaction';
      toast.error(errorMsg);
    }
  };

  const fetchClientTransaction = async () => {
    setLoading(true);
    try {
      const data: ClientTransactionProps =
        await clientTransactionService.getClientTransaction(parseInt(id!));
      setAmount(data.amount);
      setDate(data.date);
      setClientId(data.client.id.toString());
      setPaymentMethod(data.paymentMethod);
      setRemark(data.remark);
      setClientList([data.client]);
      setClientTransaction(data);
    } catch (error) {
      console.error('ClientTransactionEdit: fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientTransaction();
  }, [id]);

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
    loading,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useClientTransactionEdit };