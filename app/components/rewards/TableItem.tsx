interface TableItemProps {
  left: React.ReactNode;
  right: React.ReactNode;
  first?: boolean;
  last?: boolean;
  className?: string;
}

export default function TableItem({
  left,
  right,
  first,
  last,
  className,
}: TableItemProps) {
  return (
    <div
      className={`flex items-center justify-between bg-white px-3 py-2 pr-5 dark:bg-neutral-900 ${first && "rounded-t-lg"} ${last && "rounded-b-lg"} ${!first && "border-t border-neutral-300 dark:border-neutral-800"} ${className}`}
    >
      <div className="flex items-center gap-4">{left}</div>
      <div className="flex items-center gap-4">{right}</div>
    </div>
  );
}
