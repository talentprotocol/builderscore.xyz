import { ENDPOINTS } from "@/app/config/api";
import axios from "axios";
import { revalidateTag } from "next/cache";
import "server-only";

export const CACHE_TAGS = {
  GRANTS: "grants",
  GRANT_BY_ID: "grant-by-id",
  LEADERBOARDS: "leaderboards",
  LEADERBOARD_BY_ID: "leaderboard-by-id",
  SPONSORS: "sponsors",
  SPONSOR_BY_SLUG: "sponsor-by-slug",
  TALENT_PROFILE: "talent-profile",
  TALENT_SOCIALS: "talent-socials",
  TALENT_BUILDER_SCORE: "talent-builder-score",
  TALENT_ACCOUNTS: "talent-accounts",
  TALENT_CREDENTIALS: "talent-credentials",
  TALENT_CREDENTIALS_DATAPOINTS: "talent-credentials-datapoints",
  SEARCH: "search",
  STATS_DAILY: "stats-daily",
  TALENT_LOOKUP: "talent-lookup",
  CHART_METRICS: "chart-metrics",
  SEARCH_ADVANCED: "search-advanced",
  SEARCH_FIELDS: "search-fields",
  SEARCH_DOCUMENTS: "search-documents",
  NOTIFICATION_TOKENS: "notification-tokens",
  ANALYTICS_ACTIVE_USERS: "analytics-active-users",
};

export const CACHE_60_MINUTES = 60 * 60;

export function invalidateMultipleTags(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag);
  }
}

export function invalidateAllCache() {
  const allTags = Object.values(CACHE_TAGS);
  invalidateMultipleTags(allTags);
  return allTags;
}

export async function revalidateAllCache(): Promise<boolean> {
  try {
    await axios.get(
      `${ENDPOINTS.localApi.revalidate.all}?all=true&token=${process.env.REVALIDATION_TOKEN}`,
    );
    return true;
  } catch {
    return false;
  }
}
