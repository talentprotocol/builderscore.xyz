import ProfileView from "@/app/components/rewards/ProfileView";
import {
  fetchTalentBuilderScore,
  fetchTalentProfile,
} from "@/app/services/talent";
import { fetchTalentProfileByFid } from "@/app/services/talent";
import { TalentProfileResponse } from "@/app/types/talent";
import { notFound } from "next/navigation";
import { validate } from "uuid";

export default async function Page({
  params,
}: {
  params: Promise<{ level_one: string; level_two: string }>;
}) {
  const { level_two } = await params;

  let usableProfile: TalentProfileResponse | null;

  if (validate(level_two)) {
    usableProfile = await fetchTalentProfile(level_two);
  } else {
    usableProfile = await fetchTalentProfileByFid(parseInt(level_two));
  }

  if (!usableProfile) {
    return notFound();
  }

  const builderScore = await fetchTalentBuilderScore(usableProfile.profile.id);

  return (
    <ProfileView
      profile={usableProfile.profile}
      builderScore={builderScore!.score}
    />
  );
}
