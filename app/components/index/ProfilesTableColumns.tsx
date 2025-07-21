"use client";

import { DataTableColumnHeader } from "@/app/components/data-table/data-table-column-header";
import { Badge } from "@/app/components/ui/badge";
import type { TalentSearchProfile } from "@/app/types/talent";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Hash, Star, User } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

export function getProfilesTableColumns(
  page: number = 1,
  perPage: number = 10,
): ColumnDef<TalentSearchProfile>[] {
  return [
    {
      id: "row_number",
      accessorKey: "row_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="#" />
      ),
      enableHiding: true,
      meta: {
        label: "Row Number",
        placeholder: "Search by #",
        variant: "text",
        icon: Hash,
      },
      enableColumnFilter: true,
      enableSorting: false,
      size: 30,
      cell: ({ row }) => {
        const rowNumber = (page - 1) * perPage + row.index + 1;
        return <span className="text-xs text-neutral-500">{rowNumber}</span>;
      },
    },
    {
      id: "builder",
      accessorKey: "display_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Builder" />
      ),
      enableHiding: true,
      meta: {
        label: "Builder",
        placeholder: "Search by Builder",
        variant: "text",
        icon: User,
      },
      enableColumnFilter: true,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.original.image_url && (
              <img
                src={row.original.image_url}
                alt={row.original.display_name || "Builder"}
                width={12}
                height={12}
                className="aspect-square rounded-full object-cover"
              />
            )}
            <span className={`${row.original.image_url && "ml-1"} truncate`}>
              {row.original.display_name || row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      id: "bio",
      accessorKey: "bio",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bio" />
      ),
      enableHiding: true,
      enableSorting: false,
      meta: {
        label: "Bio",
      },
      cell: ({ row }) => (
        <p className="truncate text-xs text-neutral-400">
          {row.original.bio || "No bio"}
        </p>
      ),
    },
    {
      id: "location",
      accessorKey: "location",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Location" />
      ),
      enableHiding: true,
      enableSorting: false,
      meta: {
        label: "Location",
      },
    },
    {
      id: "builder_score",
      accessorKey: "builder_score",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Builder Score" />
      ),
      enableHiding: true,
      enableColumnFilter: true,
      enableSorting: true,
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Human Checkmark" />
      ),
      enableHiding: true,
      enableSorting: false,
      meta: {
        label: "Human Checkmark",
      },
      cell: ({ row }) => {
        return (
          row.original.human_checkmark && (
            <BadgeCheck size={14} className="text-neutral-500" />
          )
        );
      },
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      enableHiding: true,
      enableSorting: false,
      meta: {
        label: "Tags",
      },
      cell: ({ row }) => {
        return row.original.tags?.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="mr-1 px-1 py-0.5 text-[8px] uppercase"
          >
            {tag}
          </Badge>
        ));
      },
    },
  ];
}
