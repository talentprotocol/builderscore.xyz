import { fetchTalentProfile } from "@/app/services/talent";
import { TalentProfileResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");

  if (!uuid) {
    return NextResponse.json(
      { error: "Talent UUID is required" },
      { status: 400 },
    );
  }

  try {
    const data: TalentProfileResponse | null = await fetchTalentProfile(uuid);

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch profile: ${error}` },
      { status: 500 },
    );
  }
}
