"use client";

import { Button } from "@/app/components/ui/button";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import type { Table } from "@tanstack/react-table";
import { Download, EyeIcon } from "lucide-react";

interface ProfilesTableActionBarProps {
  table: Table<TalentProfileSearchApi>;
}

export function ProfilesTableActionBar({ table }: ProfilesTableActionBarProps) {
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  if (!hasSelectedRows) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground text-sm">
        {selectedRows.length} profile{selectedRows.length > 1 ? "s" : ""}{" "}
        selected
      </p>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1"
        onClick={() => {
          // Implement viewing selected profiles
          console.log("View selected profiles", selectedRows);
          table.resetRowSelection();
        }}
      >
        <EyeIcon className="h-3.5 w-3.5" />
        <span>View</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1"
        onClick={() => {
          // Implement exporting selected profiles
          console.log("Export selected profiles", selectedRows);
          table.resetRowSelection();
        }}
      >
        <Download className="h-3.5 w-3.5" />
        <span>Export</span>
      </Button>
    </div>
  );
}
