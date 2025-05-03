import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { LeaderboardResponse } from "@/app/types/leaderboards";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchLeaderboards = unstable_cache(
  async (queryString: string) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.leaderboards}?${queryString}`,
      {
        headers: DEFAULT_HEADERS,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.LEADERBOARDS],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grant_id = searchParams.get("grant_id");
    const sponsor_slug = searchParams.get("sponsor_slug");
    const per_page = searchParams.get("per_page");
    const page = searchParams.get("page");

    const queryParams = new URLSearchParams({
      ...(grant_id && { grant_id }),
      ...(sponsor_slug && { sponsor_slug }),
      ...(per_page && { per_page }),
      ...(page && { page }),
    });

    const data: LeaderboardResponse = await fetchLeaderboards(
      queryParams.toString(),
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboards: ${error}` },
      { status: 500 },
    );
  }
}
