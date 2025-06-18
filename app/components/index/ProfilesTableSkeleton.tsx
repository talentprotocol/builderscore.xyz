"use client";

import ProfilesTable from "@/app/components/index/ProfilesTable";
import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { TalentProfileSearchApi } from "@/app/types/talent";
import {
  SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function ProfilesTableSkeleton({
  originalProfiles,
  originalSorting,
  page,
  perPage,
  columnOrder,
}: {
  originalProfiles: TalentProfileSearchApi[];
  originalSorting: SortingState;
  page: number;
  perPage: number;
  columnOrder: string[];
}) {
  const table = useReactTable({
    data: originalProfiles,
    columns: getProfilesTableColumns(page, perPage),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: originalSorting,
      columnOrder,
    },
  });

  return <ProfilesTable table={table} isLoading />;
}
