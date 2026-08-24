import { useState } from 'react';
import type { AttendanceSplitInputProps } from '../../DTOs/AttendanceSplitInputProps';

export const useAttendanceSplitInputValidate = (
  props: AttendanceSplitInputProps,
) => {
  const { workerRoleId, shiftId, noOfPersons } = props;

  const initialError = {
    workerRoleId: '',
    shiftId: '',
    noOfPersons: '',
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

    if (!workerRoleId) updateError('workerRoleId', 'Please select a worker role');
    if (!shiftId) updateError('shiftId', 'Please select a shift');
    if (!noOfPersons || isNaN(Number(noOfPersons)))
      updateError('noOfPersons', 'Enter a valid number of persons');

    return isValid;
  };

  return { error, validate, setError, resetErrors, initialError };
};