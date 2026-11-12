import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

const RoleCardSkeleton = () => (
  <div
    className="bg-white dark:bg-[var(--card)] rounded-xl p-3 flex items-center justify-between border"
    style={{ borderColor: 'var(--border)' }}
  >
    {/* Avatar + name */}
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <Skeleton className="w-9 h-9 rounded-lg shrink-0 bg-border" />
      <Skeleton className="h-4 w-32 bg-border" />
    </div>

    {/* Action buttons + chevron */}
    <div className="flex items-center gap-1.5 shrink-0">
      <Skeleton className="w-8 h-8 rounded-md bg-border" />
      <Skeleton className="w-8 h-8 rounded-md bg-border" />
      <Skeleton className="w-5 h-5 rounded-sm ml-1 bg-border" />
    </div>
  </div>
);

const RolesPageSkeleton = () => (
  <div className="min-h-screen w-full px-4 py-6 pb-10">

    {/* Header */}
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-7 w-36 bg-border" />
      <Skeleton className="h-9 w-36 rounded-md bg-border" />
    </div>

    <Card className="mt-4 p-6">

      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-28 bg-border" />
        <Skeleton className="h-8 w-10 rounded-lg bg-border" />
      </div>

      {/* Role rows */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <RoleCardSkeleton key={i} />
        ))}
      </div>

    </Card>
  </div>
);

export { RolesPageSkeleton };
