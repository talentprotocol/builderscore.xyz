import { DataTableColumnsOptions } from "@/app/components/data-table/data-table-columns-options";
import ProfilesTableViewOptions from "@/app/components/index/ProfilesTableViewOptions";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { exportTableToCSV } from "@/app/lib/data-table/export";
import { ViewOption } from "@/app/types/index/data";
import { Table } from "@tanstack/react-table";
import { ArrowRightFromLine, SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function ProfilesTableOptions<TData>({
  table,
  selectedView,
  setSelectedView,
  showPagination,
  setShowPagination,
  showTotal,
  setShowTotal,
  columnOrder,
  onColumnOrderChange,
}: {
  table: Table<TData> | undefined;
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  showPagination: boolean;
  setShowPagination: (show: boolean) => void;
  showTotal: boolean;
  setShowTotal: (show: boolean) => void;
  columnOrder?: string[];
  onColumnOrderChange?: (columnOrder: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="button-style text-xs" size="sm" disabled={!table}>
          <SettingsIcon className="text-neutral-500" />
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown-menu-style w-48" align="end">
        <ProfilesTableViewOptions
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          showPagination={showPagination}
          setShowPagination={setShowPagination}
          showTotal={showTotal}
          setShowTotal={setShowTotal}
        />
        <DataTableColumnsOptions
          table={table}
          columnOrder={columnOrder}
          onColumnOrderChange={onColumnOrderChange}
        />
        <DropdownMenuItem
          className="dropdown-menu-item-style"
          onClick={() =>
            exportTableToCSV(table!, {
              filename: `Talent-Protocol-Profiles-${new Date().toISOString().split("T")[0]}`,
            })
          }
        >
          <ArrowRightFromLine className="text-neutral-500" />
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
