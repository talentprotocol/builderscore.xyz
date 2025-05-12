"use client";

import { Checkbox } from "@/app/components/ui/checkbox";
import { CREDENTIALS } from "@/app/lib/constants";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import type { ColumnDef } from "@tanstack/react-table";
import { Star, User } from "lucide-react";

export function getProfilesTableColumns(): ColumnDef<TalentProfileSearchApi>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "identity",
      accessorKey: "display_name",
      header: "Builder",
      enableHiding: true,
      meta: {
        label: "Identity",
        placeholder: "Search by Identity",
        variant: "text",
        icon: User,
      },
      enableColumnFilter: true,
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
      enableColumnFilter: true,
      cell: ({ row }) => row.original.builder_score?.points ?? "N/A",
      meta: {
        label: "Builder Score",
        placeholder: "Filter by Builder Score",
        variant: "range",
        range: [0, 1000],
        unit: "",
        icon: Star,
      },
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
      id: "credentials",
      header: "Credentials",
      enableHiding: true,
      enableColumnFilter: true,
      meta: {
        label: "Credentials",
        placeholder: "Filter by Credentials",
        variant: "multiSelect",
        options: CREDENTIALS.flatMap((credential) =>
          credential.dataPoints.map((dataPoint) => ({
            label: `${dataPoint}`,
            value: JSON.stringify({
              dataPoint,
              dataIssuer: credential.dataIssuer,
            }),
            group: credential.dataIssuer,
          })),
        ),
      },
    },
  ];
}
