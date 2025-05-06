import BaseLogo from "@/app/components/logos/BaseLogo";
import TalentProtocolLogo from "@/app/components/logos/TalentProtocolLogo";
import { SponsorInfo } from "@/app/types/rewards/sponsors";

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
};

export const DEFAULT_SPONSOR_SLUG = SPONSORS.base.slug;
