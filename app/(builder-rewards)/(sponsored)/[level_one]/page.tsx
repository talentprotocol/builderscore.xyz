import ProfileView from "@/app/components/rewards/ProfileView";
import RewardsView from "@/app/components/rewards/RewardsView";
import { SPONSORS } from "@/app/lib/constants";
import getUsableProfile from "@/app/lib/get-usable-profile";
import getUsableSponsor from "@/app/lib/get-usable-sponsor";
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

    return <ProfileView profile={usableProfile} />;
  }

  return <RewardsView sponsor={usableSponsor} />;
}
