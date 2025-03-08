import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { SponsorsResponse } from '@/app/types/sponsors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const perPage = searchParams.get('per_page');

    const response = await axios.get<SponsorsResponse>(`${API_BASE_URL}${ENDPOINTS.sponsors}`, {
      params: {
        per_page: perPage,
      },
      headers: DEFAULT_HEADERS,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
} 