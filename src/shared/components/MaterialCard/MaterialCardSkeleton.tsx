import { Skeleton } from "@/shared/components/ui/skeleton";

const MaterialCardSkeleton = () => {
  return (
    <div
      className="p-4 rounded-xl border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Header: name + delete */}
      <div className="flex justify-between items-center mb-3">
        <Skeleton className="h-5 w-36 bg-border" />
        <Skeleton className="h-8 w-8 rounded-md bg-border" />
      </div>

      {/* Info chips */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded bg-border" />
        <Skeleton className="h-6 w-24 rounded bg-border" />
        <Skeleton className="h-6 w-16 rounded bg-border" />
      </div>
    </div>
  );
};

export { MaterialCardSkeleton };
