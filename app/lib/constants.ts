import BaseLogo from "@/app/components/logos/BaseLogo";
import CeloLogo from "@/app/components/logos/CeloLogo";
import TalentProtocolLogo from "@/app/components/logos/TalentProtocolLogo";
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

export const HOF_MAX_ETH = 1;

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

const baseFrame = {
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

export const SPONSORS: Record<string, SponsorInfo> = {
  base: {
    slug: "base",
    name: "Base",
    themeClassName: "light",
    ticker: "ETH",
    logo: BaseLogo,
    color: "#0052FF",
  },
  "talent-protocol": {
    slug: "talent-protocol",
    name: "Talent Protocol",
    themeClassName: "dark",
    ticker: "$TALENT",
    logo: TalentProtocolLogo,
    color: "#FFFFFF",
  },
  celo: {
    slug: "celo",
    name: "Celo",
    themeClassName: "light",
    ticker: "CELO",
    logo: CeloLogo,
    color: "#000000",
  },
};
