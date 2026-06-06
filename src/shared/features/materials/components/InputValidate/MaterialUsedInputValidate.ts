import { useState } from 'react';

interface MaterialUsedInputProps {
  siteId: string;
  materialId: string;
  quantity: string;
  workModeId: string;
  date: string;
  availableQuantity?: string | null;
  maximumAllowedQuantity?: string | null;
}

const useMaterialUsedInputValidate = (props: MaterialUsedInputProps) => {
  const {
    siteId,
    materialId,
    workModeId,
    quantity,
    date,
    availableQuantity,
    maximumAllowedQuantity,
  } = props;

  const initialError = {
    siteId: '',
    materialId: '',
    workModeId: '',
    quantity: '',
    date: '',
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

    if (!date) updateError('date', 'Date is required');

    if (!siteId.trim()) updateError('siteId', 'Please select a site');

    if (!materialId.trim()) updateError('materialId', 'Please select a material');

    if (!quantity.trim() || isNaN(parseFloat(quantity))) {
      updateError('quantity', 'Please enter a valid quantity');
    } else if (parseFloat(quantity) <= 0) {
      updateError('quantity', 'Quantity must be greater than 0');
    } else if (
      maximumAllowedQuantity !== null &&
      maximumAllowedQuantity !== undefined &&
      maximumAllowedQuantity !== '' &&
      parseFloat(quantity) > parseFloat(maximumAllowedQuantity)
    ) {
      updateError('quantity', `Quantity cannot exceed maximum allowed (${maximumAllowedQuantity})`);
    } else if (
      availableQuantity !== null &&
      availableQuantity !== undefined &&
      availableQuantity !== '' &&
      parseFloat(quantity) > parseFloat(availableQuantity)
    ) {
      updateError('quantity', `Quantity cannot exceed available stock (${availableQuantity})`);
    }

    if (!workModeId) updateError('workModeId', 'Please select a work mode');

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useMaterialUsedInputValidate };