import { cn } from '@/shared/components/lib/utils';
import { useLanguage } from '@/shared/hooks/useLanguageContext';

interface QuantityLimitBadgeProps {
  quantity: string;
  maximumAllowedQuantity: string | null;
  visible?: boolean;
}

export const QuantityLimitBadge = ({
  quantity,
  maximumAllowedQuantity,
  visible = true,
}: QuantityLimitBadgeProps) => {
  const { t } = useLanguage();

  if (!visible || maximumAllowedQuantity === null || maximumAllowedQuantity === '') {
    return null;
  }

  const entered = parseFloat(quantity);
  const max = parseFloat(maximumAllowedQuantity);
  const isExceeded = !isNaN(entered) && !isNaN(max) && entered > max;

  return (
    <div
      className={cn(
        'self-start px-2.5 py-1.5 rounded-md border text-xs font-medium -mt-1',
        isExceeded
          ? 'bg-red-50 border-red-200 text-red-600'
          : 'bg-blue-50 border-blue-200 text-blue-700',
      )}
    >
      {isExceeded
        ? `⚠  ${t('Exceeds maximum allowed')} (${maximumAllowedQuantity})`
        : `✓  ${t('Max allowed')}: ${maximumAllowedQuantity}`}
    </div>
  );
};