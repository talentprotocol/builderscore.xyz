export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-neutral-400 dark:text-neutral-500" />
    </div>
  );
}
