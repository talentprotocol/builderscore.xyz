"use client";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import type { DataTableRowAction } from "@/app/types/data-table";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

interface GetProfilesTableColumnsOptions {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TalentProfileSearchApi> | null>
  >;
}

export function getProfilesTableColumns({
  setRowAction,
}: GetProfilesTableColumnsOptions): ColumnDef<TalentProfileSearchApi>[] {
  return [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      enableHiding: true,
    },
    {
      id: "display_name",
      accessorKey: "display_name",
      header: "Display Name",
      enableHiding: true,
    },
    {
      id: "location",
      accessorKey: "location",
      header: "Location",
      enableHiding: true,
    },
    {
      id: "builder_score",
      accessorKey: "builder_score",
      header: "Builder Score",
      enableHiding: true,
      cell: ({ row }) => row.original.builder_score?.points ?? "N/A",
    },
    {
      id: "human_checkmark",
      accessorKey: "human_checkmark",
      header: "Human Checkmark",
      enableHiding: true,
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: "Tags",
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setRowAction({ variant: "view", row })}
            >
              View Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
