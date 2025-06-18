import { BuilderData, getCSVData } from "@/app/services/rewards/analytics";
import { fetchTopBuildersLeaderboard } from "@/app/services/rewards/top-builders";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<BuilderData[]>> {
  try {
    const data = await getCSVData();
    const topBuildersData = await fetchTopBuildersLeaderboard(data.topBuilders);

    return NextResponse.json(topBuildersData);
  } catch (error) {
    console.error("Error fetching top builders leaderboard:", error);
    return NextResponse.json([], { status: 500 });
  }
}
