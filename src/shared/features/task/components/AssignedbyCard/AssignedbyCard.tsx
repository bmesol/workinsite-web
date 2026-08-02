import { Phone } from 'lucide-react';
import type { Supervisor } from '../../DTOs/TaskProps';

interface AssignedByCardProps {
  assignedBy: Supervisor;
}

const AssignedByCard = ({ assignedBy }: AssignedByCardProps) => {
  const handlePhoneCall = (phone?: string) => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="flex items-center mt-2">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <span className="text-xs font-bold">
          {assignedBy.name?.substring(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 ml-2.5">
        <span className="text-base font-semibold">
          {assignedBy.name}
          {assignedBy.role?.name && (
            <span className="text-sm font-normal text-gray-500">
              {' '}
              ({assignedBy.role.name})
            </span>
          )}
        </span>
      </div>

      <button
        type="button"
        onClick={() => handlePhoneCall(assignedBy.phone)}
        disabled={!assignedBy.phone}
        className="p-1.5 rounded-md hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Phone className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
      </button>
    </div>
  );
};

export default AssignedByCard;