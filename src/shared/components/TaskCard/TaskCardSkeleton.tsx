import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const TaskCardSkeleton = () => {
  return (
    <Card className="w-full p-4 flex flex-col gap-1.5">
      {/* Row 1: id + name + delete */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48 bg-border" />
        <Skeleton className="h-5 w-5 bg-border" />
      </div>

      {/* Row 2: site | supervisor */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-28 bg-border" />
        <Skeleton className="h-4 w-28 bg-border" />
      </div>

      {/* Row 3: date + badges */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 bg-border" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full bg-border" />
          <Skeleton className="h-6 w-16 rounded-full bg-border" />
        </div>
      </div>
    </Card>
  );
};

export { TaskCardSkeleton };
