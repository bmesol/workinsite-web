import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

const PageRoleCardSkeleton = () => (
  <Card className="p-4 flex flex-col gap-3">
    {/* Page name */}
    <Skeleton className="h-5 w-36 bg-border" />

    {/* Three role-level buttons */}
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-8 w-24 rounded-lg bg-border" />
      <Skeleton className="h-8 w-16 rounded-lg bg-border" />
      <Skeleton className="h-8 w-16 rounded-lg bg-border" />
    </div>
  </Card>
);

const PageRoleSkeleton = () => (
  <div className="min-h-screen w-full px-4 py-6 pb-24">

    {/* Header */}
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-7 w-48 bg-border" />
    </div>

    {/* Page cards grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <PageRoleCardSkeleton key={i} />
      ))}
    </div>

    {/* Fixed footer buttons */}
    <div
      className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white dark:bg-[var(--card)] border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-md bg-border" />
        <Skeleton className="h-10 flex-1 rounded-md bg-border" />
      </div>
    </div>

  </div>
);

export { PageRoleSkeleton };
