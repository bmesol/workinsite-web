import { useState } from 'react';

interface MaterialShiftInputProps {
  date: string;
  materialId: string;
  sourceSiteId: string;
  targetSiteId: string;
  quantity: string;
  availableQuantity?: string | null;   // create mode: max from site stock
  maximumAllowedQuantity?: string | null; // edit mode: max from API
}

const useMaterialShiftInputValidate = (props: MaterialShiftInputProps) => {
  const {
    date,
    materialId,
    sourceSiteId,
    targetSiteId,
    quantity,
    availableQuantity,
    maximumAllowedQuantity,
  } = props;

  const initialError = {
    date: '',
    sourceSiteId: '',
    materialId: '',
    quantity: '',
    targetSiteId: '',
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

    if (!date) {
      updateError('date', 'Date is required');
    }

    if (!sourceSiteId.trim()) {
      updateError('sourceSiteId', 'Please select a source site');
    }

    if (!materialId.trim()) {
      updateError('materialId', 'Please select a material');
    }

    const qty = parseFloat(quantity);

    if (!quantity.trim() || isNaN(qty)) {
      updateError('quantity', 'Please enter a valid quantity');
    } else if (qty <= 0) {
      updateError('quantity', 'Quantity must be greater than 0');
    } else if (
      // Edit mode: check against maximumAllowedQuantity from API
      maximumAllowedQuantity !== null &&
      maximumAllowedQuantity !== undefined &&
      maximumAllowedQuantity !== '' &&
      qty > parseFloat(maximumAllowedQuantity)
    ) {
      updateError(
        'quantity',
        `Quantity cannot exceed maximum allowed (${maximumAllowedQuantity})`,
      );
    } else if (
      // Create mode: check against site available stock
      maximumAllowedQuantity === null ||
      maximumAllowedQuantity === undefined ||
      maximumAllowedQuantity === ''
    ) {
      if (
        availableQuantity !== null &&
        availableQuantity !== undefined &&
        availableQuantity !== '' &&
        qty > parseFloat(availableQuantity)
      ) {
        updateError(
          'quantity',
          `Quantity cannot exceed available stock (${availableQuantity})`,
        );
      }
    }

    if (!targetSiteId.trim()) {
      updateError('targetSiteId', 'Please select a target site');
    } else if (sourceSiteId && targetSiteId === sourceSiteId) {
      updateError('targetSiteId', 'Target site must differ from source site');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useMaterialShiftInputValidate };