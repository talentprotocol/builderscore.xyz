import { DataTableColumnsOptions } from "@/app/components/data-table/data-table-columns-options";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { exportTableToCSV } from "@/app/lib/data-table/export";
import { Table } from "@tanstack/react-table";
import { ArrowRightFromLine, Rows3, SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function ProfilesTableOptions<TData>({
  table,
}: {
  table: Table<TData> | undefined;
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
        <DropdownMenuItem className="dropdown-menu-item-style">
          <Rows3 className="text-neutral-500" />
          View
        </DropdownMenuItem>
        <DataTableColumnsOptions table={table} />
        <DropdownMenuItem
          className="dropdown-menu-item-style"
          onClick={() =>
            exportTableToCSV(table!, {
              filename: `Talent-Protocol-Profiles-${new Date().toISOString().split("T")[0]}`,
            })
          }
        >
          <ArrowRightFromLine className="text-neutral-500" />
          Export
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
