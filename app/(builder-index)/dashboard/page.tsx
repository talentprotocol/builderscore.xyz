import { ProfilesTable } from "@/app/components/index/ProfilesTable";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="w-full p-8 text-center">Loading profiles data...</div>
        }
      >
        <ProfilesTable />
      </Suspense>
    </div>
  );
}
