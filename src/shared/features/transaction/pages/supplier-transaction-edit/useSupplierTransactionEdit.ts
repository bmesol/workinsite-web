import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import { useSupplierTransactionService } from '../../service/SupplierTransactionService';
import { useInputValidate } from '../../components/InputValidate/ClientTransactionInputValidate';
import type { SupplierTransactionProps } from '../../DTOs/SupplierTransaction';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/features/attendance/utils/functions';
import { SupplierTransactionUrls } from '../../utils/urls';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

const useSupplierTransactionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const supplierService = useSupplierService();
  const supplierTransactionService = useSupplierTransactionService();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [supplierTransaction, setSupplierTransaction] = useState<SupplierTransactionProps>();
  const [loading, setLoading] = useState(true);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const today = new Date();
  const formatted = formatDateToString(today);

  const { error, validate, setError, initialError } = useInputValidate({
    clientId: supplierId,
    date,
    amount,
    paymentMethod,
  });

  const fetchSuppliers = async (searchString: string = '') => {
    const suppliers = await supplierService.getSuppliers(searchString);
    if (!suppliers) return;
    setSupplierList(searchString ? suppliers.slice(0, 3) : suppliers);
  };

  const supplierDetails = supplierList.map(item => ({
    label: item.name,
    value: item.id.toString(),
  }));

  const handleSelect = (id: string) => {
    setPaymentMethod(id as PaymentMethodType);
  };

  const hasUnsavedChanges = useCallback(() => {
    return (
      amount.trim() !== supplierTransaction?.amount ||
      remark.trim() !== supplierTransaction?.remark ||
      supplierId.trim() !== supplierTransaction?.supplier.id.toString() ||
      date !== supplierTransaction?.date ||
      paymentMethod !== supplierTransaction?.paymentMethod
    );
  }, [amount, remark, supplierId, date, paymentMethod, supplierTransaction]);

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setSupplierId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowUnsavedDialog(true);
    } else {
      resetFormFields();
      navigate(SupplierTransactionUrls.list);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        supplierId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      };

      await supplierTransactionService.updateSupplierTransaction(
        parseInt(id!),
        payload,
      );
      resetFormFields();
      navigate(SupplierTransactionUrls.list);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.[0]?.message || 'Failed to Edit Supplier Transaction';
      toast.error(errorMsg);
    }
  };

  const fetchSupplierTransaction = async () => {
    setLoading(true);
    try {
      const data: SupplierTransactionProps =
        await supplierTransactionService.getSupplierTransaction(parseInt(id!));
      setAmount(data.amount);
      setDate(data.date);
      setSupplierId(data.supplier.id.toString());
      setPaymentMethod(data.paymentMethod);
      setRemark(data.remark);
      setSupplierList([data.supplier]);
      setSupplierTransaction(data);
    } catch (error) {
      console.error('SupplierTransactionEdit: fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierTransaction();
  }, [id]);

  return {
    handleBack,
    handleSelect,
    handleSubmit,
    amount, setAmount,
    remark, setRemark,
    date, setDate,
    supplierId, setSupplierId,
    fetchSuppliers,
    supplierDetails,
    paymentMethod,
    error,
    loading,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useSupplierTransactionEdit };