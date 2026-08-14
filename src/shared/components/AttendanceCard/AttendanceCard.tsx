import { Briefcase, Banknote, CalendarDays, User, Trash2 } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { usePermission } from "@/shared/hooks/usePermission";

interface AttendanceCardProps {
  siteName: string;
  attendanceId?: string | number;
  workTypeName: string;
  wageTypeName: string;
  date: string;
  worker: string;
  onDelete: () => void;
  onPress: () => void;
  permissionKey: string;
}

const AttendanceCard = ({
  siteName,
  attendanceId,
  workTypeName,
  wageTypeName,
  date,
  worker,
  onDelete,
  onPress,
  permissionKey,
}: AttendanceCardProps) => {
  const { canEdit } = usePermission();
  const hasPermission = permissionKey ? canEdit(permissionKey) : true;

  return (
    <Card
      className="w-full relative p-4 cursor-pointer hover:shadow-sm transition-shadow"
      onClick={onPress}
    >
      {/* Top-right — Delete Button */}
      {hasPermission && (
        <button
          className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      )}

      {/* Details */}
      <div className="flex flex-col gap-1 min-w-0 pr-8">
        {/* Site Name with ID */}
        <div className="flex items-center gap-1 mb-2 min-w-0">
          {attendanceId !== undefined && (
            <span className="text-xs font-semibold text-[var(--foreground)] shrink-0">
              [{attendanceId}]
            </span>
          )}
          <span className="font-semibold text-base text-[var(--foreground)] truncate">
            {siteName}
          </span>
        </div>

        {/* Row 1 — Work Type + Wage Type */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 min-w-[120px]">
            <Briefcase className="h-4 w-4 text-[var(--foreground)] shrink-0" />
            <span className="text-sm text-[var(--foreground)] truncate">{workTypeName}</span>
          </div>

          <div className="flex items-center gap-2 min-w-[120px]">
            <Banknote className="h-4 w-4 text-[var(--foreground)] shrink-0" />
            <span className="text-sm text-[var(--foreground)] truncate">{wageTypeName}</span>
          </div>
        </div>

        {/* Row 2 — Date + Worker */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2 min-w-[120px]">
            <CalendarDays className="h-4 w-4 text-[var(--foreground)] shrink-0" />
            <span className="text-sm text-[var(--foreground)]">{date}</span>
          </div>

          <div className="flex items-center gap-2 min-w-[120px]">
            <User className="h-4 w-4 text-[var(--foreground)] shrink-0" />
            <span className="text-sm text-[var(--foreground)] truncate">{worker}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export { AttendanceCard };