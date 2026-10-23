import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ParticipantCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-12 items-center gap-3 px-1", className)}>
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <Skeleton className="h-4 flex-1" />
    </div>
  );
}
