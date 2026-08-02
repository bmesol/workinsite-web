import { Phone } from 'lucide-react';

interface SupervisorOption {
  label: string;
  value: string;
  phone?: string;
  role?: { id: number; name: string };
}

interface SelectedSupervisorCardProps {
  supervisorId: string;
  supervisorDetails: SupervisorOption[];
}

const SelectedSupervisorCard = ({
  supervisorId,
  supervisorDetails,
}: SelectedSupervisorCardProps) => {
  const selected = supervisorDetails?.find(s => s.value === supervisorId);

  if (!selected) return null;

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
          {selected.label?.substring(0, 2).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 ml-2.5">
        <span className="text-base font-semibold">
          {selected.label}
          {selected.role?.name && (
            <span className="text-sm font-normal text-gray-500">
              {' '}
              ({selected.role.name})
            </span>
          )}
        </span>
      </div>

      <button
        type="button"
        onClick={() => handlePhoneCall(selected.phone)}
        disabled={!selected.phone}
        className="p-1.5 rounded-md hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Phone className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
      </button>
    </div>
  );
};

export default SelectedSupervisorCard;