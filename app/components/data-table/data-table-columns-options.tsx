"use client";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/app/components/ui/sortable";
import { cn } from "@/app/lib/utils";
import type { Table } from "@tanstack/react-table";
import { Eye, GripVertical, ListIcon } from "lucide-react";
import * as React from "react";

interface DataTableColumnsOptionsProps<TData> {
  table: Table<TData> | undefined;
  columnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
}

export function DataTableColumnsOptions<TData>({
  table,
  columnOrder,
  onColumnOrderChange,
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

  const currentColumnOrder = React.useMemo(
    () => columnOrder || [],
    [columnOrder],
  );

  const columnsById = React.useMemo(() => {
    const map = new Map();
    columns?.forEach((column) => {
      map.set(column.id, column);
    });
    return map;
  }, [columns]);

  const orderedColumns = React.useMemo(() => {
    if (!columns || currentColumnOrder.length === 0) {
      return columns || [];
    }

    const ordered = currentColumnOrder
      .map((columnId) => columnsById.get(columnId))
      .filter(Boolean);

    const remainingColumns = columns.filter(
      (column) => !currentColumnOrder.includes(column.id),
    );

    return [...ordered, ...remainingColumns];
  }, [columns, currentColumnOrder, columnsById]);

  const sortableColumnOrder = React.useMemo(
    () =>
      orderedColumns
        .filter((column) => column.getIsVisible())
        .map((column) => column.id),
    [orderedColumns],
  );

  const handleColumnOrderChange = React.useCallback(
    (newColumnOrder: string[]) => {
      if (onColumnOrderChange) {
        onColumnOrderChange(newColumnOrder);
      }
    },
    [onColumnOrderChange],
  );

  if (!orderedColumns || orderedColumns.length === 0) {
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
          <Sortable
            value={sortableColumnOrder}
            onValueChange={handleColumnOrderChange}
            orientation="vertical"
          >
            <SortableContent withoutSlot>
              {orderedColumns
                .filter((column) => column.getIsVisible())
                .map((column) => (
                  <SortableItem key={column.id} value={column.id} asChild>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        column.toggleVisibility(!column.getIsVisible());
                      }}
                      className="dropdown-menu-item-style flex cursor-pointer items-center justify-between gap-2 pl-1"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <SortableItemHandle>
                          <GripVertical
                            size={12}
                            className="cursor-grab text-neutral-400 hover:text-neutral-600"
                          />
                        </SortableItemHandle>
                        <span className="truncate">
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                      </div>

                      <Eye
                        className={cn(
                          "pointer-events-none ml-auto size-4 shrink-0",
                          column.getIsVisible() ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </DropdownMenuItem>
                  </SortableItem>
                ))}
            </SortableContent>
            <SortableOverlay>
              {({ value }) => {
                const column = orderedColumns.find((col) => col.id === value);
                return column ? (
                  <div className="[&_svg:not([class*='text-'])]:text-muted-foreground dropdown-menu-item-style-dragging relative flex items-center justify-between gap-2 rounded-sm bg-purple-500 px-2 py-1.5 pl-1 text-sm outline-hidden select-none data-dragging:cursor-grabbing [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                    <div className="flex items-center gap-2">
                      <GripVertical size={12} className="text-neutral-400" />
                      <span className="truncate">
                        {column.columnDef.meta?.label ?? column.id}
                      </span>
                    </div>
                    <Eye
                      className={cn(
                        "ml-auto size-4 shrink-0",
                        column.getIsVisible() ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                ) : null;
              }}
            </SortableOverlay>
          </Sortable>

          {orderedColumns.filter((column) => !column.getIsVisible()).length >
            0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-neutral-500">
                Hidden
              </DropdownMenuLabel>
            </>
          )}

          {orderedColumns
            .filter((column) => !column.getIsVisible())
            .map((column) => (
              <DropdownMenuItem
                key={column.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  column.toggleVisibility(!column.getIsVisible());
                }}
                className="dropdown-menu-item-style flex cursor-pointer items-center justify-between gap-2"
              >
                <span className="truncate">
                  {column.columnDef.meta?.label ?? column.id}
                </span>
                <Eye className="pointer-events-none ml-auto size-4 shrink-0 text-neutral-600" />
              </DropdownMenuItem>
            ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
