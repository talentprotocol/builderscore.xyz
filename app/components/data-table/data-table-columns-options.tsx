"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";
import type { Table } from "@tanstack/react-table";
import { Check, ListIcon } from "lucide-react";
import * as React from "react";

interface DataTableColumnsOptionsProps<TData> {
  table: Table<TData> | undefined;
}

export function DataTableColumnsOptions<TData>({
  table,
}: DataTableColumnsOptionsProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        ?.getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide(),
        ),
    [table],
  );

  if (!table) {
    return null;
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="dropdown-menu-item-style">
        <ListIcon className="text-neutral-500" />
        Properties
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="dropdown-menu-style w-48">
          {columns?.map((column) => (
            <DropdownMenuItem
              key={column.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                column.toggleVisibility(!column.getIsVisible());
              }}
              className="dropdown-menu-item-style flex items-center justify-between"
            >
              <span className="truncate">
                {column.columnDef.meta?.label ?? column.id}
              </span>
              <Check
                className={cn(
                  "ml-auto size-4 shrink-0",
                  column.getIsVisible() ? "opacity-100" : "opacity-0",
                )}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
