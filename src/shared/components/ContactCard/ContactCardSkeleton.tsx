import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
const ContactCardSkeleton = () => {
  return (
    <Card className="w-full flex flex-row justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0 bg-border" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-32 bg-border" />
          <Skeleton className="h-4 w-28 bg-border" />
          <Skeleton className="h-4 w-40 bg-border" />
        </div>
      </div>
      <Skeleton className="h-9 w-9 rounded-md ml-2 shrink-0 bg-border" />
    </Card>
  );
};

export { ContactCardSkeleton };
