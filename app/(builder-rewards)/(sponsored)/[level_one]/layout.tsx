import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import getUsableSponsor from "@/app/lib/get-usable-sponsor";
import { getMetadata } from "@/app/lib/metadata";
import { getSponsorThemeClassName } from "@/app/lib/theme";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level_one: string }>;
}): Promise<Metadata> {
  const { level_one } = await params;
  const usableSponsor = await getUsableSponsor(level_one);

  const metadata = getMetadata(usableSponsor);

  return metadata;
}

export default async function SponsoredRewardsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ level_one: string }>;
}>) {
  const { level_one } = await params;
  const usableSponsor = await getUsableSponsor(level_one);

  return (
    <RewardsLayout
      themeClassName={getSponsorThemeClassName(usableSponsor)}
      title="Builder Rewards"
      sponsor={usableSponsor}
    >
      {children}
    </RewardsLayout>
  );
}
