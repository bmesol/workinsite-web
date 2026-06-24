import { useState } from 'react';

interface TaskInputValidateProps {
  taskName: string;
  siteId: string;
  date: string;
  priority: number | string;
  status: number | string;
  supervisorId: string;
}

const useTaskInputValidate = (props: TaskInputValidateProps) => {
  const { taskName, siteId, date, priority, status, supervisorId } = props;

  const initialError = {
    taskName: '',
    site: '',
    date: '',
    priority: '',
    status: '',
    supervisor: '',
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

    if (!taskName) updateError('taskName', 'Please enter task name');
    if (!siteId) updateError('site', 'Please select site');
    if (!date) updateError('date', 'Please select date');
    if (!priority) updateError('priority', 'Please select priority');
    if (!status) updateError('status', 'Please select status');
    if (!supervisorId)
      updateError('supervisor', 'Please select supervisor');

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useTaskInputValidate };