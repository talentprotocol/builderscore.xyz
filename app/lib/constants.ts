export const DEFAULT_SPONSOR_SLUG = "base";

export const ALLOWED_SPONSORS = ["base", "celo", "talent-protocol"];

export const baseFrame = {
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

export const baseMetadata = {
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
    "fc:frame": JSON.stringify(baseFrame),
  },
};

export const celoFrame = {
  version: "next",
  imageUrl: "https://celo.builderscore.xyz/images/celo/frame-image.png",
  button: {
    title: "Earn Celo Builder Rewards",
    action: {
      type: "launch_frame",
      name: "Celo Builder Rewards",
      url: "https://celo.builderscore.xyz",
      splashImageUrl: "https://celo.builderscore.xyz/images/celo/icon.png",
      splashBackgroundColor: "#fcf6f1",
    },
  },
};

export const celoMetadata = {
  title: "Celo Builder Rewards",
  description: "Weekly Rewards for the most impactful builders on Celo.",
  openGraph: {
    title: "Celo Builder Rewards",
    description: "Weekly Rewards for the most impactful builders on Celo.",
    images: [
      {
        url: "https://celo.builderscore.xyz/images/celo/frame-image.png",
        alt: "Celo Builder Rewards",
      },
    ],
  },
  other: {
    "fc:frame": JSON.stringify(celoFrame),
  },
};
