import { cn } from "@/app/lib/utils";
import { ChevronRightIcon } from "lucide-react";

interface ListItemProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  first?: boolean;
  last?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ListItem({
  left,
  right,
  first,
  last,
  className,
  onClick,
}: ListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between bg-white px-3 py-2 dark:bg-neutral-900",
        first && "rounded-t-lg",
        last && "rounded-b-lg",
        !first && "border-t border-neutral-300 dark:border-neutral-800",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {left && (
        <div
          className={cn(
            "flex w-1/2 items-center gap-4",
            right && "w-1/2",
            !right && "w-full",
          )}
        >
          {left}
        </div>
      )}

      {right && (
        <div
          className={cn(
            "flex w-1/2 items-center justify-end gap-4",
            left && "w-1/2",
            !left && "w-full",
          )}
        >
          {right}
        </div>
      )}

      {onClick && <ChevronRightIcon className="mt-[1px] size-4 opacity-50" />}
    </div>
  );
}
