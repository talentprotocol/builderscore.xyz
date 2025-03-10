import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { Sponsor } from '@/app/types/sponsors';

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.sponsors}/${slug}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Sponsor = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsor with slug: ${error}` },
      { status: 500 }
    );
  }
} 