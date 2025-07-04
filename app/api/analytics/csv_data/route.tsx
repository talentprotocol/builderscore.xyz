import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { getCSVData } from "@/app/services/rewards/analytics";
import { NextResponse } from "next/server";

const getCSVDataCached = (sponsor: string) =>
  unstable_cache(
    async () => {
      const csvData = await getCSVData(sponsor);
      return {
        success: true,
        data: csvData,
      };
    },
    [CACHE_TAGS.ANALYTICS_CSV_DATA, sponsor],
    { revalidate: CACHE_60_MINUTES },
  );

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sponsor = searchParams.get("sponsor");

    if (!sponsor) {
      return NextResponse.json(
        { error: "Sponsor is required" },
        { status: 400 },
      );
    }

    const result = (await getCSVDataCached(sponsor)()).data;
    return NextResponse.json(result);
  } catch (error) {
    const errorResponse = {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
