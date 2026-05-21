import { useState } from 'react';
import type { AttendanceInputProps } from '../../DTOs/AttendanceInputProps';

const useAttendanceInputValidate = (props: AttendanceInputProps) => {
  const {
    date,
    siteId,
    wageTypeId,
    workTypeId,
    workerId,
    workedQuantity,
    unitId,
    workModeId,
    attendanceSplit,
  } = props;

  const initialError = {
    date: '',
    site: '',
    wageType: '',
    workType: '',
    worker: '',
    workedQuantity: '',
    unit: '',
    workMode: '',
    attendanceSplit: '',
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

    if (!date) updateError('date', 'Please select a date');
    if (!siteId) updateError('site', 'Please select a site');
    if (!wageTypeId) updateError('wageType', 'Please select a wage type');
    if (!workTypeId || workTypeId === '0')
      updateError('workType', 'Please select a work type');
    if (!workerId) updateError('worker', 'Please select a worker');
    if (!workedQuantity || isNaN(Number(workedQuantity)))
      updateError('workedQuantity', 'Enter a valid worked quantity');
    if (!unitId) updateError('unit', 'Please select a unit');
    if (!workModeId) updateError('workMode', 'Please select a work mode');
    if (!attendanceSplit || attendanceSplit.length === 0)
      updateError('attendanceSplit', 'Please add attendance split');

    return isValid;
  };

  return { error, validate, setError, resetErrors, initialError };
};

export { useAttendanceInputValidate };