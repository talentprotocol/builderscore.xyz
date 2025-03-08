import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { LeaderboardResponse } from '@/app/types/leaderboards';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grant_id = searchParams.get('grant_id');
    const sponsor_slug = searchParams.get('sponsor_slug');
    const per_page = searchParams.get('per_page');
    const page = searchParams.get('page');

    const queryParams = new URLSearchParams({
      ...(grant_id && { grant_id }),
      ...(sponsor_slug && { sponsor_slug }),
      ...(per_page && { per_page }),
      ...(page && { page }),
    });

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.leaderboards}?${queryParams}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LeaderboardResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching leaderboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboards' },
      { status: 500 }
    );
  }
} 