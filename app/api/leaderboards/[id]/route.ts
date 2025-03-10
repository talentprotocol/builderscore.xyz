import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { LeaderboardEntry } from '@/app/types/leaderboards';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const grant_id = searchParams.get('grant_id');

    const queryParams = new URLSearchParams({
      ...(grant_id && { grant_id }),
    });

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.leaderboards}/${id}?${queryParams}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LeaderboardEntry = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboard entry for user ${params.id}: ${error}` },
      { status: 500 }
    );
  }
} 