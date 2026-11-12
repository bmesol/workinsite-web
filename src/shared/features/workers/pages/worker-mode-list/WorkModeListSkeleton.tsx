import { Skeleton } from '@/shared/components/ui/skeleton';

const WorkModeListSkeletonRow = () => (
  <div className="flex items-center justify-between px-4 py-3 rounded-md border bg-white">
    <Skeleton className="h-5 w-36 bg-border" />
    <div className="flex items-center gap-2 shrink-0">
      <Skeleton className="h-8 w-8 rounded-md bg-border" />
      <Skeleton className="h-8 w-8 rounded-md bg-border" />
    </div>
  </div>
);

const WorkModeListSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: rows }).map((_, i) => (
      <WorkModeListSkeletonRow key={i} />
    ))}
  </div>
);

export { WorkModeListSkeleton };
