import { fetchTalentAccounts } from "@/app/services/talent";
import { TalentAccountsResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json({ error: "Fid is required" }, { status: 400 });
  }

  try {
    const data: TalentAccountsResponse | null = await fetchTalentAccounts(fid);

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch accounts: ${error}` },
      { status: 500 },
    );
  }
}
