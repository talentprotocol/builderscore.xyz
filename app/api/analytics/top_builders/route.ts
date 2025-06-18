import { BuilderData, getCSVData } from "@/app/services/rewards/analytics";
import { fetchTopBuildersLeaderboard } from "@/app/services/rewards/top-builders";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
): Promise<NextResponse<BuilderData[]>> {
  try {
    const { searchParams } = new URL(request.url);
    const sponsorSlug = searchParams.get("sponsor_slug") || "";

    const data = await getCSVData(sponsorSlug);
    const topBuildersData = await fetchTopBuildersLeaderboard(data.topBuilders);

    return NextResponse.json(topBuildersData);
  } catch (error) {
    console.error("Error fetching top builders leaderboard:", error);
    return NextResponse.json([], { status: 500 });
  }
}
