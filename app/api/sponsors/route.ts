import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchSponsors = unstable_cache(
  async (queryString: string) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.sponsors}?${queryString}`,
      {
        headers: DEFAULT_HEADERS,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.SPONSORS],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const perPage = searchParams.get("per_page");

    const queryParams = new URLSearchParams({
      ...(perPage && { per_page: perPage }),
    });

    const data: SponsorsResponse = await fetchSponsors(queryParams.toString());
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsors: ${error}` },
      { status: 500 },
    );
  }
}
