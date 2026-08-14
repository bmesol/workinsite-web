import { useState } from 'react';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

interface InputValidateProps {
  supplierId: string;
  date: string;
  amount: string;
  paymentMethod: string;
}

type ErrorType = {
  supplierId: string;
  date: string;
  amount: string;
  paymentMethod: string;
};

const useSupplierInputValidate = (props: InputValidateProps) => {
  const { supplierId, date, amount, paymentMethod } = props;

  const initialError: ErrorType = {
    supplierId: '',
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

    if (!supplierId) updateError('supplierId', 'Please select supplier');
    if (!date) updateError('date', 'Please select date');
    if (!amount || isNaN(Number(amount))) updateError('amount', 'Please enter a valid amount');

    if (
      !Object.values(PaymentMethodEnum).includes(paymentMethod as PaymentMethodEnum)
    ) {
      updateError('paymentMethod', 'Invalid payment method');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useSupplierInputValidate };
