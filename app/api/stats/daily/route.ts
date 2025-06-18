import { fetchDailyStatsData } from "@/app/services/index/daily-stats";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const queryString = request.nextUrl.searchParams.toString();
    const data = await fetchDailyStatsData(queryString);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stats daily: ${error}` },
      { status: 500 },
    );
  }
}
