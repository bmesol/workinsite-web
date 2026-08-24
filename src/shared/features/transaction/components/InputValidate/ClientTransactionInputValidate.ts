import { useState } from 'react';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

interface SplitInput {
  siteId: string;
  amount: string;
}

interface InputValidateProps {
  clientId: string;
  date: string;
  paymentMethod: string;
  splits: SplitInput[];
}

type ErrorType = {
  clientId: string;
  date: string;
  paymentMethod: string;
  splits: string;
};

const useInputValidate = (props: InputValidateProps) => {
  const { clientId, date, paymentMethod, splits } = props;

  const initialError: ErrorType = {
    clientId: '',
    date: '',
    paymentMethod: '',
    splits: '',
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

    if (splits.length === 0) {
      updateError('splits', 'Please add at least one site split');
    } else {
      const hasInvalid = splits.some(
        s => !s.siteId || !s.amount || isNaN(Number(s.amount)),
      );
      if (hasInvalid) {
        updateError('splits', 'Each split must have a site and valid amount');
      }
    }

    if (
      !Object.values(PaymentMethodEnum).includes(
        paymentMethod as PaymentMethodEnum,
      )
    ) {
      updateError('paymentMethod', 'Invalid payment method');
    }

    return isValid;
  };

  return { error, validate, setError, initialError };
};

export { useInputValidate };