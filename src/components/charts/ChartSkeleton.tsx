// src/components/charts/ChartSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ChartSkeletonProps {
  height?: number | string;
  className?: string;
}

export function ChartSkeleton({
  height = 300,
  className,
}: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );
}