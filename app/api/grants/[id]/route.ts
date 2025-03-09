import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { Grant } from '@/app/types/grants';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.grants}/${id}`,
      {
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Grant = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching grant with id ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch grant' },
      { status: 500 }
    );
  }
} 