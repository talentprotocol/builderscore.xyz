import { getProfilesTableColumns } from "@/app/components/index/ProfilesTableColumns";
import { DataTable } from "@/app/components/ui/data-table";
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

  return <DataTable table={table} isLoading />;
}
