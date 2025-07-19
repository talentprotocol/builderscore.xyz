import { fetchTalentCredentialsDatapoints } from "@/app/services/talent";
import { TalentDataPointsResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  const slug = searchParams.get("slug");

  if (!uuid || !slug) {
    return NextResponse.json(
      { error: "Talent UUID and credentialslug are required" },
      { status: 400 },
    );
  }

  try {
    const data: TalentDataPointsResponse | null =
      await fetchTalentCredentialsDatapoints(uuid, slug);

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch credentials: ${error}` },
      { status: 500 },
    );
  }
}
