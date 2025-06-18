import { fetchLeaderboardEntry } from "@/app/services/rewards/leaderboards";
import { LeaderboardEntry } from "@/app/types/rewards/leaderboards";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get("user_id");
    const grant_id = searchParams.get("grant_id");
    const sponsor_slug = searchParams.get("sponsor_slug");

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const data: LeaderboardEntry = await fetchLeaderboardEntry(
      user_id,
      grant_id || undefined,
      sponsor_slug || undefined,
    );
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Leaderboard entry not found" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: `Failed to fetch leaderboard entry: ${error}` },
      { status: 500 },
    );
  }
}
