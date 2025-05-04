import { metadata } from "@/app/(builder-rewards)/layout";
import RewardsLayout from "@/app/components/rewards/RewardsLayout";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getSponsorThemeClassName } from "@/app/lib/theme";

export default async function UnsponsoredRewardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeClassName = getSponsorThemeClassName(DEFAULT_SPONSOR_SLUG);

  return (
    <RewardsLayout
      themeClassName={themeClassName}
      title={metadata.title as string}
      sponsor={DEFAULT_SPONSOR_SLUG}
    >
      {children}
    </RewardsLayout>
  );
}
