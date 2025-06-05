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

export default async function SponsoredRewardsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ sponsor: string }>;
}>) {
  const { sponsor } = await params;
  let themeClassName = getSponsorThemeClassName(sponsor);

  if (!themeClassName) {
    themeClassName = getSponsorThemeClassName(DEFAULT_SPONSOR_SLUG);
  }

  return (
    <RewardsLayout
      themeClassName={themeClassName}
      title="Builder Rewards"
      sponsor={sponsor}
    >
      {children}
    </RewardsLayout>
  );
}
