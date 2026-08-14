import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSupplierService } from '@/shared/features/suppliers/service/SupplierService';
import { useSupplierTransactionService } from '../../service/SupplierTransactionService';
import { useSupplierInputValidate } from '../../components/InputValidate/SupplierTransactionInputValidate';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';
import { formatDateToString } from '@/shared/utils/function';
import { SupplierTransactionUrls } from '../../utils/urls';
import type { Supplier } from '@/shared/features/suppliers/DTOs/SupplierProps';

type PaymentMethodType = typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];

const useSupplierTransactionCreation = () => {
  const navigate = useNavigate();
  const supplierService = useSupplierService();
  const supplierTransactionService = useSupplierTransactionService();

  const today = new Date();
  const formatted = formatDateToString(today);

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(formatted);
  const [remark, setRemark] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethodEnum.CASH);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const { error, validate, setError, initialError } = useSupplierInputValidate({
    supplierId,
    date,
    amount,
    paymentMethod,
  });

  const resetFormFields = () => {
    setAmount('');
    setRemark('');
    setSupplierId('');
    setPaymentMethod(PaymentMethodEnum.CASH);
    setDate(formatted);
    setError(initialError);
  };

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
    setPaymentMethod(id as PaymentMethodEnum);
  };

  const hasUnsavedChanges = useCallback(() =>
    amount.trim() !== '' ||
    remark.trim() !== '' ||
    supplierId !== '' ||
    date !== formatted ||
    paymentMethod !== PaymentMethodEnum.CASH,
  [amount, remark, supplierId, date, paymentMethod, formatted]);

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
      await supplierTransactionService.createSupplierTransaction({
        supplierId,
        date: date.trim(),
        amount: amount.trim(),
        paymentMethod,
        remark: remark.trim(),
      });
      resetFormFields();
      navigate(SupplierTransactionUrls.list);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.[0]?.message ||
        err?.response?.data?.message ||
        'Failed to Create Supplier Transaction.',
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
    supplierId, setSupplierId,
    fetchSuppliers,
    supplierDetails,
    paymentMethod,
    error,
    hasUnsavedChanges,
    showUnsavedDialog,
    setShowUnsavedDialog,
    resetFormFields,
  };
};

export { useSupplierTransactionCreation };