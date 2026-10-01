import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  hint?: string;
}

export function EmptyState({
  message,
  hint = 'Try changing the date range to see more records.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox size={36} className="text-slate-300 mb-3" />
      <p className="font-medium text-slate-500" style={{ fontSize: 'var(--font-sm)' }}>
        {message}
      </p>
      {hint && (
        <p className="text-slate-400 mt-1" style={{ fontSize: 'var(--font-xs)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
