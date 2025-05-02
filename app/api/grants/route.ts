import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from "@/app/config/api";
import { GrantsResponse } from "@/app/types/grants";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { CACHE_TAGS, CACHE_60_MINUTES } from "@/app/lib/cache-utils";

export const dynamic = "force-dynamic";

const fetchGrants = unstable_cache(
  async (queryString: string) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.grants}?${queryString}`,
      {
        headers: DEFAULT_HEADERS,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.GRANTS],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const end_date_after = searchParams.get("end_date_after");
    const end_date_before = searchParams.get("end_date_before");
    const sponsor_slug = searchParams.get("sponsor_slug");
    const per_page = searchParams.get("per_page");
    const page = searchParams.get("page");

    const queryParams = new URLSearchParams({
      ...(end_date_after && { end_date_after }),
      ...(end_date_before && { end_date_before }),
      ...(sponsor_slug && { sponsor_slug }),
      ...(per_page && { per_page }),
      ...(page && { page }),
    });

    const data: GrantsResponse = await fetchGrants(queryParams.toString());
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch grants: ${error}` },
      { status: 500 },
    );
  }
}
