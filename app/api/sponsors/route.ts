import { fetchSponsors } from "@/app/services/rewards/sponsors";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const perPage = searchParams.get("per_page");

    const params = {
      ...(perPage && { per_page: parseInt(perPage) }),
    };

    const data: SponsorsResponse = await fetchSponsors(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch sponsors: ${error}` },
      { status: 500 },
    );
  }
}
