"use client";

import { TalentProfileSearchApi } from "@/app/types/talent";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TalentProfileSearchApi>[] = [
  {
    header: "Name",
    accessorKey: "display_name",
  },
  {
    header: "Location",
    accessorKey: "location",
  },
  {
    header: "Builder Score",
    accessorKey: "builder_score.points",
  },
  {
    header: "Tags",
    accessorKey: "tags",
  },
];
