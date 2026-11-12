import { Skeleton } from '@/shared/components/ui/skeleton';

const ShiftListSkeletonRow = () => (
  <div className="flex items-center justify-between px-4 py-3 rounded-md border bg-white">
    {/* label + [sublabel] */}
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <Skeleton className="h-5 w-28 bg-border" />
      <Skeleton className="h-5 w-14 bg-border" />
    </div>
    <div className="flex items-center gap-2 shrink-0">
      <Skeleton className="h-8 w-8 rounded-md bg-border" />
      <Skeleton className="h-8 w-8 rounded-md bg-border" />
    </div>
  </div>
);

const ShiftListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: rows }).map((_, i) => (
      <ShiftListSkeletonRow key={i} />
    ))}
  </div>
);

export { ShiftListSkeleton };
