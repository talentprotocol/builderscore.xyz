import { fetchTalentCredentials } from "@/app/services/talent";
import { TalentCredentialsResponse } from "@/app/types/talent";
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
    const data: TalentCredentialsResponse | null =
      await fetchTalentCredentials(uuid);

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
