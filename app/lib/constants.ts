import BaseLogo from "@/app/components/logos/BaseLogo";
import CeloLogo from "@/app/components/logos/CeloLogo";
import TalentProtocolIcon from "@/app/components/logos/TalentProtocolIcon";
import { WalletKitLogo } from "@/app/components/logos/WalletKitLogo";
import { BaseSummerBanner } from "@/app/components/rewards/BaseSummerBanner";
import { Grant } from "@/app/types/rewards/grants";
import { SponsorInfo } from "@/app/types/rewards/sponsors";
import { Metadata } from "next";

export const DEFAULT_SEARCH_DOCUMENT = "profiles";
export const DEFAULT_SEARCH_QUERY = {
  combinator: "and",
  rules: [],
};
export const DEFAULT_SEARCH_SORT = "desc";
export const DEFAULT_SEARCH_PER_PAGE = 10;

export const TABLE_CONTENT_HEIGHT = "h-[20rem]";
export const MAX_TABLE_CONTENT_HEIGHT = `max-${TABLE_CONTENT_HEIGHT}`;
export const TABLE_HEIGHT = "h-[22.45rem]";
export const PER_PAGE_OPTIONS = [10, 50, 100, 250];
export const COLUMN_ORDER = [
  "row_number",
  "builder",
  "bio",
  "location",
  "builder_score",
  "human_checkmark",
  "tags",
];

export const ALL_TIME_GRANT = {
  id: -1,
  start_date: new Date("1970-01-01").toISOString(),
  end_date: new Date("2100-01-01").toISOString(),
  rewards_pool: "",
  token_ticker: "",
  rewarded_builders: 0,
  total_builders: 0,
  avg_builder_score: 0,
  track_type: "intermediate",
  tracked: true,
  sponsor: {
    id: 0,
    name: "all_time",
    slug: "all_time",
    description: "all_time",
    logo_url: "all_time",
    color: "all_time",
    website_url: "all_time",
  },
} as Grant;

export const DEFAULT_SPONSOR_SLUG = "base-summer";

export const ALLOWED_SPONSORS = [
  "base-summer",
  "base",
  "celo",
  "talent-protocol",
  "reown",
];

export const SELECT_EXCLUDED_SPONSORS = ["reown"];

export const SUBDOMAIN_TO_SPONSOR = {
  "base-summer": "base-summer",
  base: "base-summer",
  celo: "celo",
  "talent-protocol": "talent-protocol",
  reown: "reown",
};

export const SPONSOR_TERMS = {
  "base-summer":
    "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
  base: "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
  celo: "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions-celo",
  "talent-protocol":
    "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
  reown: "", // TODO REOWN: Add terms url
  default:
    "https://docs.talentprotocol.com/docs/legal/builder-rewards-terms-conditions",
};

const baseFrame = {
  version: "next",
  imageUrl: "https://www.builderscore.xyz/images/frame-image-1.png",
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
      url: "https://www.builderscore.xyz/images/frame-image-1.png",
      alt: "Base Builder Rewards",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Builder Rewards",
    description: "Weekly Rewards for the most impactful builders.",
    images: {
      url: "https://www.builderscore.xyz/images/frame-image-1.png",
      alt: "Base Builder Rewards",
    },
    site: "@TalentProtocol",
    creator: "@TalentProtocol",
  },
  other: {
    "fc:frame": JSON.stringify(baseFrame),
  },
};

const celoFrame = {
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

const reownFrame = {
  version: "next",
  imageUrl: "https://reown.builderscore.xyz/images/reown/frame-image.png", // TODO REOWN: Add image url
  button: {
    title: "Earn WalletKit Builder Rewards",
    action: {
      type: "launch_frame",
      name: "WalletKit Builder Rewards",
      url: "https://reown.builderscore.xyz",
      splashImageUrl: "https://reown.builderscore.xyz/images/reown/icon.png", // TODO REOWN: Add splash image url
      splashBackgroundColor: "#ffb800",
    },
  },
};

export const reownMetadata: Metadata = {
  title: "WalletKit Builder Rewards",
  description: "WalletKit Rewards for the most impactful builders.",
  openGraph: {
    title: "WalletKit Builder Rewards",
    description: "WalletKit Rewards for the most impactful builders.",
    images: {
      url: "https://reown.builderscore.xyz/images/reown/frame-image.png",
      alt: "WalletKit Builder Rewards",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "WalletKit Builder Rewards",
    description: "WalletKit Rewards for the most impactful builders.",
    images: {
      url: "https://reown.builderscore.xyz/images/reown/frame-image.png",
      alt: "WalletKit Builder Rewards",
    },
    site: "@TalentProtocol",
    creator: "@TalentProtocol",
  },
  other: {
    "fc:frame": JSON.stringify(reownFrame),
  },
};

export const SPONSORS: Record<string, SponsorInfo> = {
  "base-summer": {
    slug: "base",
    name: "Base",
    themeClassName: "light",
    ticker: "ETH",
    logo: BaseLogo,
    color: "#0000ff",
    logoSize: "h-3",
  },
  base: {
    slug: "base",
    name: "Base",
    themeClassName: "light",
    ticker: "ETH",
    logo: BaseLogo,
    color: "#0000ff",
    logoSize: "h-3",
  },
  "talent-protocol": {
    slug: "talent-protocol",
    name: "Talent Protocol",
    themeClassName: "dark",
    ticker: "$TALENT",
    logo: TalentProtocolIcon,
    color: "#FFFFFF",
    logoSize: "h-3",
  },
  celo: {
    slug: "celo",
    name: "Celo",
    themeClassName: "light",
    ticker: "CELO",
    logo: CeloLogo,
    color: "#000000",
    logoSize: "h-3",
  },
  reown: {
    slug: "reown",
    name: "Reown",
    themeClassName: "light",
    ticker: "$WCT",
    logo: WalletKitLogo,
    color: "#ffb800",
    logoSize: "w-22",
  },
};

export const SPONSOR_SCORING = {
  "base-summer": ["github", "onchain", "farcaster"],
  base: ["github", "onchain", "farcaster"],
  "talent-protocol": ["github", "onchain", "builder_score"],
  celo: ["github", "onchain", "builder_score"],
  reown: ["github", "onchain", "builder_score"],
};

export const SPONSOR_HOF_MAX_REWARDS = {
  "base-summer": 1,
  base: 1,
  // reown: 1, // TODO REOWN: Add HOF max rewards
};

export const SPONSOR_MIN_REWARDS = {
  "base-summer": 2,
  base: 2,
  "talent-protocol": 20000,
  celo: 10000,
  reown: 1234, // TODO REOWN: Add min rewards
};

export const SPONSOR_SCANNER_BASE_URL = {
  "base-summer": "https://basescan.org/tx/",
  base: "https://basescan.org/tx/",
  celo: "https://celoscan.io/tx/",
  "talent-protocol": "https://basescan.org/tx/",
  reown: "https://basescan.org/tx/",
};

export const SPONSOR_REWARDS_START_DATE = {
  "base-summer": "2025-07-22",
  reown: "2025-09-01",
};

export const SPONSOR_BANNERS = {
  "base-summer": BaseSummerBanner,
};

export const SPONSOR_FARCASTER_MINI_APP_URLS = {
  "base-summer":
    "https://farcaster.xyz/miniapps/003OFAiGOJCy/base-builder-rewards",
  base: "https://farcaster.xyz/miniapps/003OFAiGOJCy/base-builder-rewards",
  "talent-protocol":
    "https://farcaster.xyz/miniapps/003OFAiGOJCy/base-builder-rewards",
  celo: "https://farcaster.xyz/miniapps/XhQmVJM8RIeD/celo-builder-rewards",
  reown: "", // TODO REOWN: Add mini app url
};

export const SPONSOR_REWARDS_PERIOD = {
  celo: "month",
  // reown: "month", // TODO REOWN: Add rewards period
};

export const SPONSOR_TOTAL_REWARDED = {
  "base-summer": 100,
  base: 100,
  "talent-protocol": 100,
  celo: 100,
  reown: 100,
};

export const SPONSOR_CREDENTIALS_HIGHLIGHTS = {
  "base-summer": ["base"],
  base: ["base"],
  "talent-protocol": ["talent_protocol"],
  celo: ["celo"],
  reown: ["reown"],
};
