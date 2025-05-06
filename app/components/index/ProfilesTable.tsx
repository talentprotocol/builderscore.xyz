import { columns } from "@/app/components/index/Columns";
import { DataTable } from "@/app/components/index/DataTable";
import { searchProfiles } from "@/app/services/index/search";

export async function ProfilesTable() {
  const data = await searchProfiles({
    query: {},
    sort: {
      score: {
        order: "desc",
      },
    },
    page: 1,
    per_page: 25,
  });

  return (
    <div>
      <DataTable columns={columns} data={data.profiles} />
    </div>
  );
}
