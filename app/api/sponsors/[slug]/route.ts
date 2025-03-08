import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { Sponsor } from '@/app/types/sponsors';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const response = await axios.get<Sponsor>(
      `${API_BASE_URL}${ENDPOINTS.sponsors}/${slug}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error fetching sponsor with slug ${params.slug}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch sponsor' },
      { status: 500 }
    );
  }
} 