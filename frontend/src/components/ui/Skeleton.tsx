import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  width?: string;
  circle?: boolean;
}

export function Skeleton({
  className,
  height = "h-4",
  width = "w-full",
  circle = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-sidebar",
        height,
        width,
        circle && "rounded-full",
        !circle && "rounded",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <Skeleton height="h-6" width="w-1/3" />
      <Skeleton height="h-4" width="w-2/3" />
      <Skeleton height="h-20" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton height="h-10" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="h-12" />
      ))}
    </div>
  );
}
