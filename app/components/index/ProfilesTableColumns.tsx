"use client";

import { Badge } from "@/app/components/ui/badge";
import { CREDENTIALS } from "@/app/lib/constants";
import type { TalentProfileSearchApi } from "@/app/types/talent";
import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Star, User } from "lucide-react";
import Image from "next/image";

export function getProfilesTableColumns(): ColumnDef<TalentProfileSearchApi>[] {
  return [
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
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row.original.image_url && (
              <Image
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
      id: "location",
      accessorKey: "location",
      header: "Location",
      enableHiding: true,
      enableSorting: false,
      meta: {
        label: "Location",
      },
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
      header: "Tags",
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
            className="mr-1 px-1 py-0.5 text-[7px] uppercase"
          >
            {tag}
          </Badge>
        ));
      },
    },
    {
      id: "credentials",
      accessorKey: "credentials",
      header: "Credentials",
      enableSorting: false,
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
