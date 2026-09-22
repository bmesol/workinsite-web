import type { ReactNode } from "react";
import { ChevronRightIcon } from "../DashboardIcons/DashboardIcons";
import { ValueLabel } from "../ValueLabel/ValueLabel";

type StatCardProps = {
  icon: ReactNode;
  value: string | number;
  label: string;
  bg: string;
  color: string;
  onClick?: () => void;
};

const DashboardStatCard = ({ icon, value, label, bg, color, onClick }: StatCardProps) => {
  const inner = (
    <div className="flex items-center gap-3 w-full">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + "22", color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <ValueLabel value={value} label={label} color={color} variant="dashboard" />
      </div>
      <ChevronRightIcon className="shrink-0" />
    </div>
  );

  const baseClass = "rounded-2xl px-4 py-4 shadow-sm transition-opacity";

  return onClick ? (
    <button
      onClick={onClick}
      className={`${baseClass} text-left hover:opacity-90 w-full`}
      style={{ backgroundColor: bg }}
    >
      {inner}
    </button>
  ) : (
    <div className={baseClass} style={{ backgroundColor: bg }}>
      {inner}
    </div>
  );
};

export default DashboardStatCard;
