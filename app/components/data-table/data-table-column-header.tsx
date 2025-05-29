"use client";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";
import type { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, EyeOff } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
  icon?: React.ReactNode;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  icon,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild {...props}>
        <Button
          className={cn(
            "button-style-no-border w-full gap-2 text-xs",
            className,
          )}
        >
          {icon}
          <div className="flex w-full items-center justify-between gap-1">
            {title}

            {column.getCanSort() &&
              (column.getIsSorted() === "desc" ? (
                <ChevronDown size={18} className="text-neutral-500" />
              ) : (
                <ChevronUp size={18} className="text-neutral-500" />
              ))}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="dropdown-menu-style w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="relative cursor-pointer bg-white pr-8 pl-2 text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp size={18} className="text-neutral-500" />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="relative cursor-pointer bg-white pr-8 pl-2 text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown size={18} className="text-neutral-500" />
              Desc
            </DropdownMenuCheckboxItem>
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="relative cursor-pointer bg-white pr-8 pl-2 text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff size={10} className="text-neutral-500" />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
