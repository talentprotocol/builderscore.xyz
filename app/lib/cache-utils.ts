import "server-only";
import { revalidateTag } from "next/cache";

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
    const response = await fetch(
      "/api/revalidate?all=true&token=" + process.env.REVALIDATION_TOKEN,
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to invalidate all caches", error);
    return false;
  }
}
