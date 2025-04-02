import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { LeaderboardEntry } from '@/app/types/leaderboards';
import { unstable_cache } from '@/app/lib/unstable-cache';
import { CACHE_TAGS, CACHE_60_MINUTES } from '@/app/lib/cache-utils';

const fetchLeaderboardById = unstable_cache(
  async (id: string, queryString: string) => {
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.leaderboards}/${id}?${queryString}`,
      {
        headers: DEFAULT_HEADERS
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.LEADERBOARD_BY_ID],
  { revalidate: CACHE_60_MINUTES }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const grant_id = searchParams.get("grant_id");
    const sponsor_slug = searchParams.get("sponsor_slug");

    const queryParams = new URLSearchParams({
      ...(grant_id && { grant_id }),
      ...(sponsor_slug && { sponsor_slug }),
    });

    const data: LeaderboardEntry = await fetchLeaderboardById(id, queryParams.toString());
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboard entry for user: ${error}` },
      { status: 500 }
    );
  }
} 