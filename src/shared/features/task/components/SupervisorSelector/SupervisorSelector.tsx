import { Check } from 'lucide-react';
import { cn } from '@/shared/components/lib/utils';

interface SupervisorOption {
  label: string;
  value: string;
}

interface SupervisorSelectorProps {
  supervisorDetails: SupervisorOption[];
  supervisorId: string;
  setSupervisorId: (value: string) => void;
  onSelect?: () => void; // web: replaces bottomSheetRef.current.close()
}

const SupervisorSelector = ({
  supervisorDetails,
  supervisorId,
  setSupervisorId,
  onSelect,
}: SupervisorSelectorProps) => {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      {supervisorDetails?.map(item => {
        const isSelected = supervisorId === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setSupervisorId(item.value);
              onSelect?.();
            }}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-2xl mb-3 border transition-colors text-left',
              isSelected
                ? 'bg-white border-[var(--primary)]'
                : 'bg-[#F7F7F2] border-transparent',
            )}
          >
            {/* ── Avatar ── */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isSelected
                  ? 'var(--secondary)'
                  : 'var(--primary)',
              }}
            >
              <span className="text-sm font-bold text-white">
                {item.label?.substring(0, 2).toUpperCase()}
              </span>
            </div>

            {/* ── Name ── */}
            <div className="flex-1">
              <span className="text-base font-semibold text-black">
                {item.label}
              </span>
            </div>

            {/* ── Tick / radio ── */}
            <div
              className={cn(
                'w-[22px] h-[22px] rounded-full border flex items-center justify-center shrink-0',
                isSelected
                  ? 'bg-[var(--primary)] border-[var(--primary)]'
                  : 'bg-white border-[#CBD5E0]',
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </button>
        );
      })}

      {!supervisorDetails?.length && (
        <p className="text-center mt-5 text-black">No supervisors available</p>
      )}
    </div>
  );
};

export default SupervisorSelector;