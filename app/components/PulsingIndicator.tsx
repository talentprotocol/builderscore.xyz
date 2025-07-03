import { cn } from "@/app/lib/utils";

export default function PulsingIndicator({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-2 w-2 animate-pulse rounded-full bg-green-500",
        className,
      )}
    ></div>
  );
}
