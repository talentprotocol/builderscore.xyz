import { fetchLeaderboards } from "@/app/services/rewards/leaderboards";
import { LeaderboardResponse } from "@/app/types/rewards/leaderboards";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const grant_id = searchParams.get("grant_id");
    const sponsor_slug = searchParams.get("sponsor_slug");
    const per_page = searchParams.get("per_page");
    const page = searchParams.get("page");
    const id = searchParams.get("id");
    const hall_of_fame = searchParams.get("hall_of_fame");

    const params = {
      ...(grant_id && { grant_id }),
      ...(sponsor_slug && { sponsor_slug }),
      ...(per_page && { per_page: parseInt(per_page) }),
      ...(page && { page: parseInt(page) }),
      ...(id && { id }),
      ...(hall_of_fame && { hall_of_fame: hall_of_fame === "true" }),
    };

    const data: LeaderboardResponse = await fetchLeaderboards(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch leaderboards: ${error}` },
      { status: 500 },
    );
  }
}
