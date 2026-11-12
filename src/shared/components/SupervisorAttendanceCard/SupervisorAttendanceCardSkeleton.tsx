import { Skeleton } from "@/shared/components/ui/skeleton";

const SupervisorAttendanceCardSkeleton = () => {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Header: avatar + name/role */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0 bg-border" />
        <div className="flex flex-col gap-1.5 min-w-0">
          <Skeleton className="h-4 w-32 bg-border" />
          <Skeleton className="h-5 w-20 rounded-full bg-border" />
        </div>
      </div>

      <div className="border-t mb-3" style={{ borderColor: "var(--border)" }} />

      {/* Detail rows: date, time, address */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24 bg-border" />
        <Skeleton className="h-4 w-20 bg-border" />
        <Skeleton className="h-4 w-full bg-border" />
      </div>
    </div>
  );
};

export { SupervisorAttendanceCardSkeleton };
