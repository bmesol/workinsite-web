import { Skeleton } from "@/shared/components/ui/skeleton";

interface ListPageHeaderSkeletonProps {
  buttonWidths?: string[];
}

const ListPageHeaderSkeleton = ({
  buttonWidths = ["w-32"],
}: ListPageHeaderSkeletonProps) => (
  <div className="flex justify-between items-center pt-4">
    <Skeleton className="h-7 w-40 bg-border" />
    <div className="flex items-center gap-2">
      {buttonWidths.map((w, i) => (
        <Skeleton key={i} className={`h-9 ${w} rounded-md bg-border`} />
      ))}
    </div>
  </div>
);

export { ListPageHeaderSkeleton };
