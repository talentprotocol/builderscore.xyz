import type { Metadata } from "next";

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
  return <>{children}</>;
}
