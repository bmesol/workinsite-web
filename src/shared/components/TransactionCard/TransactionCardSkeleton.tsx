import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const TransactionCardSkeleton = () => {
  return (
    <Card className="w-full flex flex-col gap-1.5 p-4">
      {/* Row 1: name + delete */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-36 bg-border" />
        <Skeleton className="h-5 w-5 bg-border" />
      </div>

      {/* Row 2: date */}
      <Skeleton className="h-4 w-24 bg-border" />

      {/* Row 3: amount + payment method */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20 bg-border" />
        <Skeleton className="h-4 w-24 bg-border" />
      </div>
    </Card>
  );
};

export { TransactionCardSkeleton };
