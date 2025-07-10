import ProfileWrapper from "@/app/components/rewards/ProfileWrapper";
import { getQueryClient } from "@/app/lib/get-query-client";
import { TalentProfileSearchApi } from "@/app/types/talent";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";

export default async function ProfileView({
  profile,
}: {
  profile: TalentProfileSearchApi;
}) {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileWrapper profile={profile} className="mt-3" detailed />
    </HydrationBoundary>
  );
}
