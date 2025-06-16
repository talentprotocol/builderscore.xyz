import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import {
  DEFAULT_SPONSOR_SLUG,
  baseMetadata,
  celoMetadata,
} from "@/app/lib/constants";
import { getSubdomain } from "@/app/lib/get-subdomain";
import { getSponsorThemeClassName } from "@/app/lib/theme";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const subdomain = await getSubdomain();

  let metadata;

  switch (subdomain) {
    case "base":
      metadata = baseMetadata;
      break;
    case "celo":
      metadata = celoMetadata;
      break;
    case "talent-protocol":
      metadata = baseMetadata;
      break;
    default:
      metadata = baseMetadata;
  }

  return metadata;
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
