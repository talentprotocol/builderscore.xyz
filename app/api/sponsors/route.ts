import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { SponsorsResponse } from '@/app/types/sponsors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const perPage = searchParams.get('per_page');

    const queryParams = new URLSearchParams({
      ...(perPage && { per_page: perPage }),
    });

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.sponsors}?${queryParams}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SponsorsResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsors: ${error}` },
      { status: 500 }
    );
  }
} 