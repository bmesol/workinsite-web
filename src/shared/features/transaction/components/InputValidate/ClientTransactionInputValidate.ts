import { useState } from 'react';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

interface InputValidateProps {
  clientId: string;
  date: string;
  amount: string;
  paymentMethod: string;
}

type ErrorType = {
  clientId: string;
  date: string;
  amount: string;
  paymentMethod: string;
};

const useInputValidate = (props: InputValidateProps) => {
  const { clientId, date, amount, paymentMethod } = props;

  const initialError: ErrorType = {
    clientId: '',
    date: '',
    amount: '',
    paymentMethod: '',
  };

  const [error, setError] = useState(initialError);
  const resetErrors = () => setError(initialError);

  const validate = () => {
    resetErrors();
    let isValid = true;

    const updateError = (field: keyof ErrorType, message: string) => {
      setError(prev => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!clientId) updateError('clientId', 'Please select client');
    if (!date) updateError('date', 'Please select date');
    if (!amount || isNaN(Number(amount)))
      updateError('amount', 'Please Enter Amount');
    if (
      !Object.values(PaymentMethodEnum).includes(
        paymentMethod as PaymentMethodEnum,
      )
    ) {
      updateError('paymentMethod', 'Invalid paymentMethod method');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useInputValidate };