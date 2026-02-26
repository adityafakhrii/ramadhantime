import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8">
      <Skeleton className="w-32 h-4 rounded" />
      <Skeleton className="w-64 h-64 rounded-full" />
      <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
