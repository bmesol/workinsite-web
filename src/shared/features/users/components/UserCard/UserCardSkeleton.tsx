import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const UserCardSkeleton = () => {
  return (
    <Card className="w-full flex flex-row items-center gap-4 p-4">
      <div className="relative flex-shrink-0">
        <Skeleton className="h-16 w-16 rounded-xl bg-border" />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <Skeleton className="h-5 w-32 bg-border" />
        <Skeleton className="h-4 w-24 bg-border" />
        <Skeleton className="h-4 w-28 bg-border" />
      </div>
    </Card>
  );
};

export { UserCardSkeleton };
