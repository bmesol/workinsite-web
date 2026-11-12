import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

const SiteCardSkeleton = () => {
  return (
    <Card className="w-full overflow-hidden">
      {/* Top row */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-border flex-shrink-0" />
          <Skeleton className="h-5 w-32 bg-border" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-border" />
          <Skeleton className="h-3 w-3 rounded-full bg-border" />
        </div>
      </div>

      <hr className="border-border mx-3" />

      {/* Bottom row */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-border flex-shrink-0" />
          <Skeleton className="h-4 w-24 bg-border" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-border" />
          <Skeleton className="h-4 w-4 rounded bg-border" />
        </div>
      </div>
    </Card>
  );
};

export { SiteCardSkeleton };
