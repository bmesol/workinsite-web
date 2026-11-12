import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const AttendanceCardSkeleton = () => {
  return (
    <Card className="w-full relative p-4">
      {/* Delete button placeholder */}
      <Skeleton className="absolute top-3 right-3 h-7 w-7 rounded-md bg-border" />

      <div className="flex flex-col gap-1 min-w-0 pr-8">
        {/* Site name + id */}
        <Skeleton className="h-5 w-40 mb-2 bg-border" />

        {/* Row 1: Work type | Wage type */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full bg-border" />
          <Skeleton className="h-4 w-full bg-border" />
        </div>

        {/* Row 2: Date | Worker */}
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full bg-border" />
          <Skeleton className="h-4 w-full bg-border" />
        </div>
      </div>
    </Card>
  );
};

export { AttendanceCardSkeleton };
