interface AvailableBadgeProps {
  qty: string;
  unit: string;
}

export function AvailableBadge({ qty, unit }: AvailableBadgeProps) {
  const num = parseFloat(qty ?? '0');
  let bgClass = 'bg-green-100 text-green-700';
  if (num < 0) bgClass = 'bg-red-100 text-red-700';
  else if (num === 0) bgClass = 'bg-amber-100 text-amber-700';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${bgClass}`}
      style={{ fontSize: 'var(--font-xs)' }}
    >
      {qty} {unit}
    </span>
  );
}
