import { useState } from 'react';
import type { WorkRateAbstractValidateProps } from '../../DTOs/WorkRateAbstract'; 

const useWorkRateAbstractValidate = (
  workRateAbstract: WorkRateAbstractValidateProps,
) => {
  const { siteId, workTypeId, totalRate, totalQuantity, unitId } = workRateAbstract;

  const initialError = {
    site: '',
    workType: '',
    totalRate: '',
    totalQuantity: '',
    unit: '',
  };

  const [error, setError] = useState(initialError);

  const resetErrors = () => setError(initialError);

  const validate = () => {
    const newError = { ...initialError }; // ✅ single re-render instead of multiple setError calls
    let isValid = true;

    const updateError = (field: keyof typeof initialError, message: string) => {
      newError[field] = message;
      isValid = false;
    };

    if (!siteId) updateError('site', 'Please select a site');
    if (!workTypeId) updateError('workType', 'Please select a work type');
    if (!totalRate || isNaN(Number(totalRate)))
      updateError('totalRate', 'Enter a valid rate');
    if (!totalQuantity || isNaN(Number(totalQuantity)))
      updateError('totalQuantity', 'Enter a valid quantity');
    if (!unitId) updateError('unit', 'Please select a unit');

    setError(newError); // ✅ single re-render
    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useWorkRateAbstractValidate };