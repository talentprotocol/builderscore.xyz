import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getMetadata } from "@/app/lib/metadata";
import { getSponsorThemeClassName } from "@/app/lib/theme";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sponsor: string }>;
}): Promise<Metadata> {
  const { sponsor } = await params;
  const metadata = getMetadata(sponsor || DEFAULT_SPONSOR_SLUG);

  return metadata;
}

export default async function SponsoredRewardsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ sponsor: string }>;
}>) {
  const { sponsor } = await params;

  return (
    <RewardsLayout
      themeClassName={getSponsorThemeClassName(sponsor || DEFAULT_SPONSOR_SLUG)}
      title="Builder Rewards"
      sponsor={sponsor}
    >
      {children}
    </RewardsLayout>
  );
}
