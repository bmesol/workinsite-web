interface SelectedSupervisorCardProps {
  supervisorId: string;
  supervisorDetails: { label: string; value: string }[];
}

const SelectedSupervisorCard = ({
  supervisorId,
  supervisorDetails,
}: SelectedSupervisorCardProps) => {
  const selected = supervisorDetails.find(s => s.value === supervisorId);
  if (!selected) return null;

  return (
    <div className="flex items-center bg-white p-3 rounded-xl border border-[#E2E8F0] mt-2 mx-1">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <span className="text-xs font-bold">
          {selected.label?.substring(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 ml-2.5">
        <span className="text-sm font-semibold">{selected.label}</span>
      </div>
    </div>
  );
};

export default SelectedSupervisorCard;