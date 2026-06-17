import { Check } from 'lucide-react';
import { PaymentMethodEnum } from '../../DTOs/ClientTransaction';

import cashImg from '@/assets/icons/cash-in-hand.png';
import bankChecksImg from '@/assets/icons/bank-checks.jpg';
import bankTransferImg from '@/assets/icons/bank-transfer.jpg';
import upiImg from '@/assets/icons/upi.webp';

const PAYMENT_METHODS = [
  { id: PaymentMethodEnum.CASH,          label: 'Cash',          image: cashImg },
  { id: PaymentMethodEnum.CHEQUE,        label: 'Cheque',        image: bankChecksImg },
  { id: PaymentMethodEnum.BANK_TRANSFER, label: 'Bank Transfer', image: bankTransferImg },
  { id: PaymentMethodEnum.UPI,           label: 'UPI',           image: upiImg },
];

interface Props {
  label?: string;
  selectedMethod: string;
  onSelect: (id: string) => void;
  required?: boolean;
  errorMessage?: string;
  disable?: boolean;
}

const PaymentMethodSelector: React.FC<Props> = ({
  label = 'Payment Method',
  selectedMethod,
  onSelect,
  required = false,
  errorMessage = 'This field is required',
  disable = false,
}) => {
  const showError = required && !selectedMethod;

  const handleSelect = (id: string) => {
    if (disable) return;
    onSelect(id);
  };

  return (
    <div className="flex flex-col gap-2">

      {/* ── Label ── */}
      <label className="text-base font-medium" style={{ color: 'var(--foreground)' }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {/* ── Payment Method Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {PAYMENT_METHODS.map(item => {
          const isSelected = item.id === selectedMethod;

          return (
            <button
              key={item.id}
              type="button"
              disabled={disable}
              onClick={() => handleSelect(item.id)}
              className={`
                relative flex flex-col items-center justify-center gap-2
                py-3 px-2 rounded-xl border transition-all min-h-[80px]
                ${isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
                ${disable ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer'}
              `}
            >
              {/* ── Image ── */}
              <img
                src={item.image}
                alt={item.label}
                className={`w-16 h-10 object-contain rounded ${disable ? 'opacity-60' : ''}`}
              />

              {/* ── Label ── */}
              <span
                className="text-xs font-medium text-center"
                style={{ color: disable ? '#888' : '#333' }}
              >
                {item.label}
              </span>

              {/* ── Selected checkmark ── */}
              {isSelected && !disable && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Error ── */}
      {showError && !disable && (
        <p className="text-xs text-red-500">{errorMessage}</p>
      )}

    </div>
  );
};

export default PaymentMethodSelector;