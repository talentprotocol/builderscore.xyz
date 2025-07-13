import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import { SUBDOMAIN_TO_SPONSOR } from "@/app/lib/constants";
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
  const usableSponsor = getUsableSponsor(level_one);

  const sponsorSlug =
    SUBDOMAIN_TO_SPONSOR[usableSponsor as keyof typeof SUBDOMAIN_TO_SPONSOR];

  const metadata = getMetadata(sponsorSlug);

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
  const usableSponsor = getUsableSponsor(level_one);

  const sponsorSlug =
    SUBDOMAIN_TO_SPONSOR[usableSponsor as keyof typeof SUBDOMAIN_TO_SPONSOR];

  return (
    <RewardsLayout
      themeClassName={getSponsorThemeClassName(sponsorSlug)}
      title="Builder Rewards"
      sponsor={sponsorSlug}
    >
      {children}
    </RewardsLayout>
  );
}
