import { metadata } from "@/app/(builder-rewards)/layout";
import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getSponsorThemeClassName } from "@/app/lib/theme";

export default async function SponsoredRewardsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ sponsor: string }>;
}>) {
  const { sponsor } = await params;
  const layoutSponsor = sponsor || DEFAULT_SPONSOR_SLUG;
  const themeClassName = getSponsorThemeClassName(layoutSponsor);

  return (
    <RewardsLayout
      themeClassName={themeClassName}
      title={metadata.title as string}
      sponsor={sponsor}
    >
      {children}
    </RewardsLayout>
  );
}
