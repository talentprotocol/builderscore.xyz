"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";
import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  EyeOff,
  X,
} from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className="flex items-center gap-1">
      {title}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn("ml-1", className)} {...props}>
          {column.getCanSort() &&
            (column.getIsSorted() === "desc" ? (
              <ChevronDown size={18} className="text-neutral-500" />
            ) : column.getIsSorted() === "asc" ? (
              <ChevronUp size={18} className="text-neutral-500" />
            ) : (
              <ChevronsUpDown size={18} className="text-neutral-500" />
            ))}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-28 border-none bg-white text-xs text-neutral-800 dark:bg-neutral-800 dark:text-white"
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
              {column.getIsSorted() && (
                <DropdownMenuItem
                  className="relative cursor-pointer bg-white pr-8 pl-2 text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
                  onClick={() => column.clearSorting()}
                >
                  <X size={18} className="text-neutral-500" />
                  Reset
                </DropdownMenuItem>
              )}
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
    </div>
  );
}
