import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ShiftListSkeleton } from "../shift-list/ShiftListSkeleton";

const ShiftCreationSkeleton = () => (
  <div className="min-h-screen w-full px-4 pb-10">
    {/* Header */}
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-7 w-16 bg-border" />
    </div>

    <Card className="mt-4">
      <CardContent className="flex flex-col gap-4">
        {/* Shift name NameField skeleton */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-16 bg-border" />
          <Skeleton className="h-9 w-full rounded-md bg-border" />
        </div>

        {/* Multiplier NameField skeleton */}
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-36 bg-border" />
          <Skeleton className="h-9 w-full rounded-md bg-border" />
        </div>

        {/* Save button skeleton */}
        <div className="flex justify-end gap-2">
          <Skeleton className="h-9 w-24 rounded-md bg-border" />
        </div>

        {/* List section title */}
        <Skeleton className="h-5 w-24 bg-border" />

        {/* Shift list rows */}
        <ShiftListSkeleton rows={5} />
      </CardContent>
    </Card>
  </div>
);

export { ShiftCreationSkeleton };
