import { LogoProps } from "@/app/types/svg";
import { ComponentType } from "react";

export const AVAILABLE_SPONSORS = ["base", "celo", "talent-protocol"] as const;

export interface SponsorInfo {
  slug: string;
  name: string;
  themeClassName: string;
  ticker: string;
  logo: ComponentType<LogoProps>;
  color: string;
}

export interface Sponsor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface SponsorsResponse {
  sponsors: Sponsor[];
  total_count: number;
  page: number;
  per_page: number;
}
