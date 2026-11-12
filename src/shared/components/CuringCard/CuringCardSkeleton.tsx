import { Skeleton } from "@/shared/components/ui/skeleton";

const CuringCardSkeleton = () => {
  return (
    <div
      className="flex items-stretch gap-3 p-4 rounded-xl border"
      style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
    >
      {/* Avatar */}
      <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0 bg-border" />

      {/* Details */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <Skeleton className="h-5 w-32 bg-border" />
        <Skeleton className="h-4 w-24 bg-border" />
        <Skeleton className="h-4 w-36 bg-border" />
      </div>

      {/* Right: status + delete */}
      <div className="flex flex-col items-end justify-between shrink-0 py-0.5 gap-2">
        <Skeleton className="h-4 w-16 bg-border" />
        <Skeleton className="h-9 w-9 rounded-md bg-border" />
      </div>
    </div>
  );
};

export { CuringCardSkeleton };
