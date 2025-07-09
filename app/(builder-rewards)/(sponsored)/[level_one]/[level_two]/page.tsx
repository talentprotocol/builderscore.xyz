import ProfileView from "@/app/components/rewards/ProfileView";
import getUsableProfile from "@/app/lib/get-usable-profile";
import getUsableSponsor from "@/app/lib/get-usable-sponsor";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ level_one: string; level_two: string }>;
}) {
  const { level_one, level_two } = await params;
  const usableSponsor = getUsableSponsor(level_one);

  const usableProfile = await getUsableProfile(level_two);

  if (!usableProfile) {
    return notFound();
  }

  return <ProfileView profile={usableProfile} sponsorSlug={usableSponsor} />;
}
