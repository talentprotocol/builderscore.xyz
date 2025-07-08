interface ListItemProps {
  left: React.ReactNode;
  right: React.ReactNode;
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
      className={`flex items-center justify-between bg-white px-3 py-2 dark:bg-neutral-900 ${first && "rounded-t-lg"} ${last && "rounded-b-lg"} ${!first && "border-t border-neutral-300 dark:border-neutral-800"} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">{left}</div>
      <div className="flex items-center gap-4">{right}</div>
    </div>
  );
}
