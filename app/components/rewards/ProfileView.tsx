import ProfileWrapper from "@/app/components/rewards/ProfileWrapper";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import {
  fetchTalentAccounts,
  fetchTalentContributedProjects,
  fetchTalentCredentials,
  fetchTalentSocials,
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

  const [
    leaderboardEntry,
    credentials,
    contributedProjects,
    socials,
    accounts,
  ] = await Promise.all([
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
      queryKey: ["talentContributedProjects", profile.id],
      queryFn: () => fetchTalentContributedProjects(profile.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["talentSocials", profile.id],
      queryFn: () => fetchTalentSocials(profile.id),
    }),
    queryClient.fetchQuery({
      queryKey: ["talentAccounts", profile.id],
      queryFn: () => fetchTalentAccounts(profile.id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileWrapper
        profile={profile}
        rewards={leaderboardEntry || undefined}
        credentials={credentials?.credentials || undefined}
        contributedProjects={contributedProjects?.projects || undefined}
        socials={socials?.socials || undefined}
        accounts={accounts?.accounts || undefined}
        className="mt-3"
        detailed
      />
    </HydrationBoundary>
  );
}
