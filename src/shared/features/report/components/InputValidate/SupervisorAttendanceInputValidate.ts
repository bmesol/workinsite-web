import { useState } from 'react';

interface SupervisorAttendanceInputProps {
  fromDate?: Date | null;
  toDate?: Date | null;
}

export const useSupervisorAttendanceInputValidate = (
  props: SupervisorAttendanceInputProps,
) => {
  const { fromDate, toDate } = props;

  const initialError = {
    fromDate: '',
    toDate: '',
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

    if (!fromDate && !toDate) return updateError('fromDate', 'Date is required');
    if (!fromDate) updateError('fromDate', 'From Date is required');
    if (!toDate) updateError('toDate', 'To Date is required');
    if (fromDate && toDate && fromDate > toDate) {
      updateError('toDate', 'To Date should be greater than or equal to From Date');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};