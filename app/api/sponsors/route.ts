import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data: SponsorsResponse = await fetchSponsors();
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsors: ${error}` },
      { status: 500 },
    );
  }
}
