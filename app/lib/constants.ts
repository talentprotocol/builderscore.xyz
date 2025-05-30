import { Metadata } from "next";

export const DEFAULT_SPONSOR_SLUG = "base";

export const ALLOWED_SPONSORS = ["base", "celo", "talent-protocol"];

export const SPONSOR_TERMS = {
  base: "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
  celo: "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions-celo",
  "talent-protocol":
    "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
  default:
    "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
};

export const baseFrame = {
  version: "next",
  imageUrl: "https://www.builderscore.xyz/images/frame-image.png",
  button: {
    title: "Earn Base Builder Rewards",
    action: {
      type: "launch_frame",
      name: "Builder Rewards",
      url: "https://www.builderscore.xyz",
      splashImageUrl: "https://www.builderscore.xyz/images/icon.png",
      splashBackgroundColor: "#0D0740",
    },
  },
};

export const baseMetadata: Metadata = {
  title: "Base Builder Rewards",
  description: "Weekly Rewards for the most impactful builders.",
  openGraph: {
    title: "Base Builder Rewards",
    description: "Weekly Rewards for the most impactful builders.",
    images: {
      url: "https://www.builderscore.xyz/images/frame-image.png",
      alt: "Base Builder Rewards",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Builder Rewards",
    description: "Weekly Rewards for the most impactful builders.",
    images: {
      url: "https://www.builderscore.xyz/images/frame-image.png",
      alt: "Base Builder Rewards",
    },
    site: "@TalentProtocol",
    creator: "@TalentProtocol",
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

export const celoMetadata: Metadata = {
  title: "Celo Builder Rewards",
  description: "CELO Rewards for the most impactful builders.",
  openGraph: {
    title: "Celo Builder Rewards",
    description: "CELO Rewards for the most impactful builders.",
    images: {
      url: "https://celo.builderscore.xyz/images/celo/frame-image.png",
      alt: "Celo Builder Rewards",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Celo Builder Rewards",
    description: "CELO Rewards for the most impactful builders.",
    images: {
      url: "https://celo.builderscore.xyz/images/celo/frame-image.png",
      alt: "Celo Builder Rewards",
    },
    site: "@TalentProtocol",
    creator: "@TalentProtocol",
  },
  other: {
    "fc:frame": JSON.stringify(celoFrame),
  },
};
