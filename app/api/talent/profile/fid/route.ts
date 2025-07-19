import { fetchTalentProfileByFid } from "@/app/services/talent";
import { TalentProfileResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  try {
    const data: TalentProfileResponse | null = await fetchTalentProfileByFid(
      parseInt(fid),
    );

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch profile: ${error}` },
      { status: 500 },
    );
  }
}
