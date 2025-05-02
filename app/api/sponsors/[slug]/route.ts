import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from "@/app/config/api";
import { Sponsor } from "@/app/types/sponsors";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { CACHE_TAGS, CACHE_60_MINUTES } from "@/app/lib/cache-utils";

export const dynamic = "force-dynamic";

const fetchSponsorBySlug = unstable_cache(
  async (slug: string) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.sponsors}/${slug}`,
      {
        headers: DEFAULT_HEADERS,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.SPONSOR_BY_SLUG],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const data: Sponsor = await fetchSponsorBySlug(slug);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsor with slug: ${error}` },
      { status: 500 },
    );
  }
}
