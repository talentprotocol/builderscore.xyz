import { invalidateMultipleTags } from "@/app/lib/cache-server-utils";
import { CACHE_TAGS } from "@/app/lib/cache-utils";
import { getQueryClient } from "@/app/lib/get-query-client";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * - To invalidate grants: /api/revalidate?tag=grants&token=YOUR_TOKEN
 * - To invalidate grant by ID: /api/revalidate?tag=grant-by-id&token=YOUR_TOKEN
 * - To invalidate multiple tags: /api/revalidate?tags=grants,grant-by-id&token=YOUR_TOKEN
 * - To invalidate all caches: /api/revalidate?all=true&token=YOUR_TOKEN
 * - Will also invalidate TanStack Query cache
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const validToken = process.env.REVALIDATION_TOKEN;

    if (!token || token !== validToken) {
      return NextResponse.json(
        { error: "Invalid or missing revalidation token" },
        { status: 401 },
      );
    }

    const queryClient = getQueryClient();

    const invalidateAll = request.nextUrl.searchParams.get("all") === "true";

    if (invalidateAll) {
      const allTags = Object.values(CACHE_TAGS);
      invalidateMultipleTags(allTags);

      queryClient.invalidateQueries();

      return NextResponse.json({
        revalidated: true,
        timestamp: Date.now(),
        invalidated: allTags,
        tanstackQueriesInvalidated: true,
      });
    }

    const tag = request.nextUrl.searchParams.get("tag");
    const tags = request.nextUrl.searchParams.get("tags");

    if (!tag && !tags) {
      return NextResponse.json(
        { error: "Missing tag, tags, or all parameter" },
        { status: 400 },
      );
    }

    if (tag) {
      const tagExists = Object.values(CACHE_TAGS).includes(tag);
      if (!tagExists) {
        return NextResponse.json(
          { error: `Invalid tag: ${tag}` },
          { status: 400 },
        );
      }

      revalidateTag(tag);

      queryClient.invalidateQueries();

      return NextResponse.json({
        revalidated: true,
        timestamp: Date.now(),
        invalidated: [tag],
        tanstackQueriesInvalidated: true,
      });
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim());
      const invalidatedTags: string[] = [];

      for (const t of tagList) {
        const tagExists = Object.values(CACHE_TAGS).includes(t);
        if (tagExists) {
          revalidateTag(t);
          invalidatedTags.push(t);
        }
      }

      queryClient.invalidateQueries();

      return NextResponse.json({
        revalidated: true,
        timestamp: Date.now(),
        invalidated: invalidatedTags,
        tanstackQueriesInvalidated: true,
      });
    }

    return NextResponse.json({ revalidated: false });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to revalidate cache: ${error}` },
      { status: 500 },
    );
  }
}
