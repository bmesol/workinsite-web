import { Skeleton } from "@/shared/components/ui/skeleton";

const MaterialUsedCardSkeleton = () => {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Header: name + delete */}
      <div className="flex justify-between items-start mb-3">
        <Skeleton className="h-5 w-36 bg-border" />
        <Skeleton className="h-6 w-6 rounded-md bg-border" />
      </div>

      {/* Info rows — 2-col grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <Skeleton className="h-4 w-full bg-border" />
        <Skeleton className="h-4 w-full bg-border" />
        <Skeleton className="h-4 w-3/4 bg-border" />
        <Skeleton className="h-4 w-3/4 bg-border" />
      </div>
    </div>
  );
};

export { MaterialUsedCardSkeleton };
