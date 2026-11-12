import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { WorkModeListSkeleton } from "../worker-mode-list/WorkModeListSkeleton";

const WorkModeCreationSkeleton = () => (
  <div className="min-h-screen w-full px-4 pb-10">
    {/* Header */}
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-7 w-28 bg-border" />
    </div>

    <Card className="mt-4">
      <CardContent className="flex flex-col gap-4">
        {/* NameField skeleton: label + input */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-24 bg-border" />
          <Skeleton className="h-9 w-full rounded-md bg-border" />
        </div>

        {/* Save button skeleton */}
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-24 rounded-md bg-border" />
        </div>

        {/* List section title */}
        <Skeleton className="h-5 w-32 bg-border" />

        {/* Work mode list rows */}
        <WorkModeListSkeleton rows={4} />
      </CardContent>
    </Card>
  </div>
);

export { WorkModeCreationSkeleton };
