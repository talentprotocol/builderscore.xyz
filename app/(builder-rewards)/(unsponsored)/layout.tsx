import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getSubdomain } from "@/app/lib/get-subdomain";
import { getMetadata } from "@/app/lib/metadata";
import { getSponsorThemeClassName } from "@/app/lib/theme";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const subdomain = await getSubdomain();
  const sponsorMetadata = getMetadata(subdomain || DEFAULT_SPONSOR_SLUG);

  return sponsorMetadata;
}

export default async function UnsponsoredRewardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sponsor = (await getSubdomain()) || DEFAULT_SPONSOR_SLUG;

  return (
    <RewardsLayout
      themeClassName={getSponsorThemeClassName(sponsor)}
      title="Builder Rewards"
      sponsor={sponsor}
    >
      {children}
    </RewardsLayout>
  );
}
