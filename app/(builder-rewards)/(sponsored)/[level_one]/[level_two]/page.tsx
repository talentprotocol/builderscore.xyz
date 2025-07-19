import ProfileView from "@/app/components/rewards/ProfileView";
import getUsableProfile from "@/app/lib/get-usable-profile";
import { fetchTalentBuilderScore } from "@/app/services/talent";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ level_one: string; level_two: string }>;
}) {
  const { level_two } = await params;

  const usableProfile = await getUsableProfile(level_two);

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
