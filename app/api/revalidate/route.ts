import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/app/lib/cache-utils";
import { invalidateMultipleTags } from "@/app/lib/cache-utils";

/**
 * - To invalidate grants: /api/revalidate?tag=grants
 * - To invalidate grant by ID: /api/revalidate?tag=grant-by-id
 * - To invalidate multiple tags: /api/revalidate?tags=grants,grant-by-id
 * - To invalidate all caches: /api/revalidate?all=true
 */
export async function GET(request: NextRequest) {
  try {
    const invalidateAll = request.nextUrl.searchParams.get("all") === "true";
    
    if (invalidateAll) {
      const allTags = Object.values(CACHE_TAGS);
      invalidateMultipleTags(allTags);
      
      return NextResponse.json({
        revalidated: true,
        timestamp: Date.now(),
        invalidated: allTags
      });
    }
    
    const tag = request.nextUrl.searchParams.get("tag");
    const tags = request.nextUrl.searchParams.get("tags");
    
    if (!tag && !tags) {
      return NextResponse.json(
        { error: "Missing tag, tags, or all parameter" },
        { status: 400 }
      );
    }

    if (tag) {
      const tagExists = Object.values(CACHE_TAGS).includes(tag);
      if (!tagExists) {
        return NextResponse.json(
          { error: `Invalid tag: ${tag}` },
          { status: 400 }
        );
      }
      
      revalidateTag(tag);
      return NextResponse.json({ 
        revalidated: true, 
        timestamp: Date.now(),
        invalidated: [tag] 
      });
    }
    
    if (tags) {
      const tagList = tags.split(",").map(t => t.trim());
      const invalidatedTags: string[] = [];
      
      for (const t of tagList) {
        const tagExists = Object.values(CACHE_TAGS).includes(t);
        if (tagExists) {
          revalidateTag(t);
          invalidatedTags.push(t);
        }
      }
      
      return NextResponse.json({ 
        revalidated: true, 
        timestamp: Date.now(),
        invalidated: invalidatedTags 
      });
    }

    return NextResponse.json({ revalidated: false });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to revalidate cache: ${error}` },
      { status: 500 }
    );
  }
} 