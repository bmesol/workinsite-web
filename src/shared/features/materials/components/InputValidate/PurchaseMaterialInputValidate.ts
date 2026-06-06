import { useState } from 'react';

interface PurchaseMaterialInputProps {
  materialId: any;
  rate: string;
  receivedQuality: string;
  receivedDate?: string;
  receivedQuantity: string;
  minQuantity?: number;
}

const usePurchaseMaterialInputValidate = (props: PurchaseMaterialInputProps) => {
  const { materialId, rate, receivedQuality, receivedDate, receivedQuantity, minQuantity = 0 } = props;

  const initialError = {
    materialId: '',
    rate: '',
    receivedQuality: '',
    receivedDate: '',
    receivedQuantity: '',
    unitId: '',
  };

  const [error, setError] = useState(initialError);
  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof typeof initialError, message: string) => {
      setError(prev => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!materialId?.trim()) updateError('materialId', 'Please select a material');
    if (!rate.trim() || isNaN(parseFloat(rate)) || parseFloat(rate) <= 0)
      updateError('rate', 'Rate is required');
    if (!receivedQuality.trim())
      updateError('receivedQuality', 'Received Quality is required');
    if (!receivedDate)
      updateError('receivedDate', 'Received Date is required');
    if (!receivedQuantity.trim() || isNaN(parseFloat(receivedQuantity)) || parseFloat(receivedQuantity) <= 0)
      updateError('receivedQuantity', 'Received quantity is required');
    else if (minQuantity > 0 && parseFloat(receivedQuantity) < minQuantity)
      updateError('receivedQuantity', `Value must be ${minQuantity} or greater`);

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { usePurchaseMaterialInputValidate };