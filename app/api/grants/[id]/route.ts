import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { Grant } from '@/app/types/grants';
import { unstable_cache } from '@/app/lib/unstable-cache';
import { CACHE_TAGS, CACHE_60_MINUTES } from '@/app/lib/cache-utils';

export const dynamic = "force-dynamic";

const fetchGrantById = unstable_cache(
  async (id: string) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.grants}/${id}`, {
      headers: DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
  [CACHE_TAGS.GRANT_BY_ID],
  { revalidate: CACHE_60_MINUTES }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const data: Grant = await fetchGrantById(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch grant: ${error}` },
      { status: 500 }
    );
  }
} 