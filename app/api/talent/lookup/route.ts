import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchProfileById = unstable_cache(
  async (id: string, accountSource: string) => {
    const profileResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${id}&account_source=${accountSource}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (profileResponse.status === 404) {
      return NextResponse.json({ error: `Profile not found` }, { status: 404 });
    }

    if (!profileResponse.ok) {
      throw new Error(
        `Talent Protocol API error: ${profileResponse.statusText}`,
      );
    }

    return profileResponse.json();
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const accountSource = searchParams.get("account_source") || "wallet";

  if (!id) {
    return NextResponse.json(
      { error: "ID parameter is required" },
      { status: 400 },
    );
  }

  try {
    const profileData = await fetchProfileById(id, accountSource);

    return NextResponse.json(profileData);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 },
    );
  }
}
