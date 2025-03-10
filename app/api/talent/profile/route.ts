import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { TalentProfileResponse } from '@/app/types/talent';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const queryObject = {
      query: {
        identity: `farcaster:${fid}`,
        exactMatch: true,
      }
    };

    const queryString = Object.keys(queryObject)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(
            JSON.stringify(queryObject[key as keyof typeof queryObject])
          )}`
      )
      .join("&");

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?${queryString}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!response.ok) {
      throw new Error(`Talent Protocol API error: ${response.statusText}`);
    }

    const data: TalentProfileResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 }
    );
  }
} 