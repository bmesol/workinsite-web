import { Skeleton } from '@/shared/components/ui/skeleton';

export function SkField() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-5 w-24 bg-border" />
      <Skeleton className="h-9 w-full bg-border" />
    </div>
  );
}

export function SkTextarea() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-5 w-24 bg-border" />
      <Skeleton className="h-20 w-full bg-border" />
    </div>
  );
}

export function SkRow2() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkField />
      <SkField />
    </div>
  );
}

export function SkPaymentMethod() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-5 w-32 bg-border" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 bg-border" />
        <Skeleton className="h-9 flex-1 bg-border" />
        <Skeleton className="h-9 flex-1 bg-border" />
      </div>
    </div>
  );
}

export function SkSectionHeader() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-28 bg-border" />
      <Skeleton className="h-8 w-16 rounded-md bg-border" />
    </div>
  );
}

export function SkSwitch() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-5 w-20 bg-border" />
      <Skeleton className="h-6 w-11 rounded-full bg-border" />
    </div>
  );
}

export function SkButtons() {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Skeleton className="h-9 w-24 bg-border" />
      <Skeleton className="h-9 w-24 bg-border" />
    </div>
  );
}
