import { ClientOnly } from "@/app/components/ClientOnly";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PER_PAGE_OPTIONS } from "@/app/lib/constants";
import { cn, formatNumber } from "@/app/lib/utils";
import { TalentProfileSearchApi } from "@/app/types/talent";
import { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function ProfilesTablePagination({
  table,
  totalProfiles,
  showPagination,
  showTotal,
}: {
  table: Table<TalentProfileSearchApi>;
  totalProfiles: number;
  showPagination: boolean;
  showTotal: boolean;
}) {
  if (!showPagination && !showTotal) return null;

  return (
    <div className="flex flex-1 items-center justify-between gap-2">
      <div className="ml-1 flex h-6 items-center">
        {showTotal && (
          <ClientOnly>
            <p
              className={cn(
                "text-xs",
                totalProfiles === 1 ? "font-semibold" : "",
              )}
            >
              {formatNumber(totalProfiles)} Builder
              {totalProfiles === 1 ? "" : "s"}
            </p>
          </ClientOnly>
        )}
      </div>

      {showPagination && (
        <div className="flex items-center gap-8 justify-self-end">
          <div className="flex items-center gap-2">
            <p className="text-xs">Rows</p>

            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="button-style h-6 w-20 cursor-pointer p-2 text-xs">
                <SelectValue placeholder="123" />
              </SelectTrigger>
              <SelectContent className="dropdown-menu-style">
                {PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    className="dropdown-menu-item-style"
                    value={option.toString()}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex min-w-36 items-center justify-end gap-2">
            <p className="text-xs">
              Page{" "}
              {table.getPageCount() > 0
                ? table.getState().pagination.pageIndex + 1
                : 0}{" "}
              of {formatNumber(table.getPageCount())}
            </p>

            <Button
              className="button-style h-6 w-6"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              className="button-style h-6 w-6"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
