import { fetchGrants } from "@/app/services/rewards/grants";
import { GrantsResponse } from "@/app/types/rewards/grants";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const end_date_after = searchParams.get("end_date_after");
    const end_date_before = searchParams.get("end_date_before");
    const sponsor_slug = searchParams.get("sponsor_slug");
    const per_page = searchParams.get("per_page");
    const page = searchParams.get("page");

    const params = {
      ...(end_date_after && { end_date_after }),
      ...(end_date_before && { end_date_before }),
      ...(sponsor_slug && { sponsor_slug }),
      ...(per_page && { per_page: parseInt(per_page) }),
      ...(page && { page: parseInt(page) }),
    };

    const data: GrantsResponse = await fetchGrants(params);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch grants: ${error}` },
      { status: 500 },
    );
  }
}
