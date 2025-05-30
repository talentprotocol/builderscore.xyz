import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { NextRequest, NextResponse } from "next/server";

const fetchStatsDaily = async (queryString: string) => {
  const response = await fetch(`${API_BASE_URL}/stats/daily?${queryString}`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.searchParams.toString();
    const data = await fetchStatsDaily(queryString);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stats daily: ${error}` },
      { status: 500 },
    );
  }
}
