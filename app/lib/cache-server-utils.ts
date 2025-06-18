import { ENDPOINTS } from "@/app/config/api";
import { CACHE_TAGS } from "@/app/lib/cache-utils";
import axios from "axios";
import { revalidateTag } from "next/cache";
import "server-only";

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
