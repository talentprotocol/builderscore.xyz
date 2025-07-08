import { Progress } from "@/app/components/ui/progress";
import { cn } from "@/app/lib/utils";
import { ChevronRightIcon, LinkIcon } from "lucide-react";
import Link from "next/link";

const ActionCardWrapper = ({
  children,
  onClick,
  href,
  hrefTarget,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  hrefTarget?: string;
}) => {
  const className = cn(
    "card-style w-full p-4 relative flex items-center",
    onClick && "cursor-pointer",
  );

  if (href) {
    return (
      <Link href={href} target={hrefTarget} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
};

export default function ActionCard({
  title,
  titleMono,
  description,
  progress,
  indicator,
  onClick,
  href,
}: {
  title: string;
  titleMono?: boolean;
  description: string;
  progress?: number;
  indicator?: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  return (
    <ActionCardWrapper onClick={onClick} href={href}>
      {indicator && <div className="absolute top-3 right-3">{indicator}</div>}

      <div
        className={cn(
          "flex w-full flex-col gap-1",
          typeof progress === "number" && "gap-2",
        )}
      >
        <div className="flex items-center gap-2">
          <h2 className="secondary-text-style text-sm">{description}</h2>
          {onClick && (
            <ChevronRightIcon className="mt-[1px] size-4 opacity-50" />
          )}

          {href && <LinkIcon className="mt-[1px] size-4 opacity-50" />}
        </div>

        <div className="flex flex-col gap-1">
          <h3
            className={cn("text-2xl font-semibold", titleMono && "font-mono")}
          >
            {title}
          </h3>

          {typeof progress === "number" && (
            <Progress value={progress} className="h-2" />
          )}
        </div>
      </div>
    </ActionCardWrapper>
  );
}
