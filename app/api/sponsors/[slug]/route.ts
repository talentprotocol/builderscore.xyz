import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { Sponsor } from "@/app/types/rewards/sponsors";
import { NextRequest, NextResponse } from "next/server";

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
