import { Skeleton } from "@/shared/components/ui/skeleton";

const SearchFilterBarSkeleton = () => (
  <div className="flex justify-end items-center mt-4">
    <Skeleton className="h-9 w-48 rounded-md bg-border" />
  </div>
);

export { SearchFilterBarSkeleton };
