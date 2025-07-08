import ProfileView from "@/app/components/rewards/ProfileView";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import getUsableProfile from "@/app/lib/get-usable-profile";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ level_one: string; level_two: string }>;
}) {
  const { level_one, level_two } = await params;

  const usableProfile = await getUsableProfile(level_two);

  if (!usableProfile) {
    return notFound();
  }

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "userLeaderboards",
      usableProfile.id,
      ALL_TIME_GRANT.id,
      level_one,
      true,
    ],
    queryFn: () =>
      fetchLeaderboardEntry(usableProfile.id, undefined, level_one) || null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView profile={usableProfile} className="mt-3" detailed />
    </HydrationBoundary>
  );
}
