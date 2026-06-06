import { useState } from 'react';

interface PurchaseInputProps {
  billNumber: string;
  siteId: string;
  supplierId: string;
  date: string;
  totalAmount: string;
  gst: string;
}

const usePurchaseInputValidate = (props: PurchaseInputProps) => {
  const { billNumber, siteId, supplierId, date, totalAmount, gst } = props;

  const initialError = {
    billNumber: '',
    siteId: '',
    supplierId: '',
    date: '',
    totalAmount: '',
    gst: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof error, message: string) => {
      setError(prev => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!billNumber.trim()) updateError('billNumber', 'Bill number is required');
    if (!siteId) updateError('siteId', 'Please select a site');
    if (!supplierId) updateError('supplierId', 'Please select a supplier');
    if (!date) updateError('date', 'Please select a date');
    if (!totalAmount.trim()) updateError('totalAmount', 'Total Amount is required');
    if (!gst.trim()) {
      updateError('gst', 'GST is required');
    } else if (!/^[0-9A-Z]{15}$/.test(gst)) {
      updateError('gst', 'Enter valid 15-digit GSTIN');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { usePurchaseInputValidate };