import ProfileView from "@/app/components/rewards/ProfileView";
import RewardsView from "@/app/components/rewards/RewardsView";
import { ALL_TIME_GRANT, SPONSORS } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import getUsableProfile from "@/app/lib/get-usable-profile";
import getUsableSponsor from "@/app/lib/get-usable-sponsor";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ level_one: string }>;
}) {
  const { level_one } = await params;
  const usableSponsor = getUsableSponsor(level_one);

  if (!SPONSORS[level_one as keyof typeof SPONSORS]) {
    const usableProfile = await getUsableProfile(level_one);

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

  return <RewardsView sponsor={usableSponsor} />;
}
