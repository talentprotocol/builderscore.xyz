import Navbar from "@/app/components/Navbar";
import { Footer } from "@/app/components/rewards/Footer";
import RewardsStatus from "@/app/components/rewards/RewardsStatus";
import UserStatus from "@/app/components/rewards/UserStatus";
import { GrantProvider } from "@/app/context/GrantContext";
import { LeaderboardProvider } from "@/app/context/LeaderboardContext";
import { SponsorProvider } from "@/app/context/SponsorContext";
import type { Metadata } from "next";
import { headers } from "next/headers";

const frame = {
  version: "next",
  imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
  button: {
    title: "Earn Builder Rewards",
    action: {
      type: "launch_frame",
      name: "Builder Rewards",
      url: "https://www.builderscore.xyz",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
    },
  },
};

export const metadata: Metadata = {
  title: "Builder Rewards",
  description: "Weekly Rewards for the most impactful builders.",
  openGraph: {
    title: "Builder Rewards",
    description: "Weekly Rewards for the most impactful builders.",
    images: [
      {
        url: "https://www.builderscore.xyz/images/frame-image.png",
        alt: "Builder Rewards",
      },
    ],
  },
  other: {
    "fc:frame": JSON.stringify(frame),
  },
};

export default async function BuilderRewardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  return (
    <SponsorProvider>
      <GrantProvider>
        <LeaderboardProvider>
          <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 py-4">
            {process.env.NODE_ENV === "development" && (
              <>
                <UserStatus />
                <RewardsStatus />
              </>
            )}
            <Navbar sponsored />
            <p>Subdomain: {subdomain || "No subdomain"}</p>
            <main className="flex h-full flex-col">{children}</main>
            <Footer />
          </div>
        </LeaderboardProvider>
      </GrantProvider>
    </SponsorProvider>
  );
}
