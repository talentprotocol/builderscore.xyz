import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { AdvancedSearchMetadataField } from "@/app/types/advancedSearchMetadataFields";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documents: string }> },
) {
  try {
    const { documents } = await params;

    const data: AdvancedSearchMetadataField[] = await fetchSearchAdvanced({
      documents,
      queryString: request.nextUrl.searchParams.toString(),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch search advanced: ${error}` },
      { status: 500 },
    );
  }
}
