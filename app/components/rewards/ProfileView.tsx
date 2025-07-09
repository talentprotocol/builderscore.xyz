import ProfileWrapper from "@/app/components/rewards/ProfileWrapper";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import {
  fetchTalentContributedProjects,
  fetchTalentCredentials,
  fetchTalentProjects,
} from "@/app/services/talent";
import { TalentProfileSearchApi } from "@/app/types/talent";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";

export default async function ProfileView({
  profile,
  sponsorSlug,
}: {
  profile: TalentProfileSearchApi;
  sponsorSlug?: string;
}) {
  const queryClient = getQueryClient();

  const [leaderboardEntry, credentials, projects, contributedProjects] =
    await Promise.all([
      queryClient.fetchQuery({
        queryKey: [
          "userLeaderboards",
          profile.id,
          ALL_TIME_GRANT.id,
          sponsorSlug,
          true,
        ],
        queryFn: () =>
          fetchLeaderboardEntry(profile.id, undefined, sponsorSlug) || null,
      }),
      queryClient.fetchQuery({
        queryKey: ["talentCredentials", profile.id],
        queryFn: () => fetchTalentCredentials(profile.id),
      }),
      queryClient.fetchQuery({
        queryKey: ["talentProjects", profile.id],
        queryFn: () => fetchTalentProjects(profile.id),
      }),
      queryClient.fetchQuery({
        queryKey: ["talentContributedProjects", profile.id],
        queryFn: () => fetchTalentContributedProjects(profile.id),
      }),
    ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileWrapper
        profile={profile}
        rewards={leaderboardEntry || undefined}
        credentials={credentials?.credentials || undefined}
        projects={projects?.projects || undefined}
        contributedProjects={contributedProjects?.projects || undefined}
        className="mt-3"
        detailed
      />
    </HydrationBoundary>
  );
}
