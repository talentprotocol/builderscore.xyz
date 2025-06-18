import { fetchSearchAdvancedMetadataFields } from "@/app/services/index/search-fields";
import { AdvancedSearchMetadataField } from "@/app/types/advancedSearchMetadataFields";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documents: string }> },
) {
  try {
    const { documents } = await params;

    const data: AdvancedSearchMetadataField[] =
      await fetchSearchAdvancedMetadataFields({ documents });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch metadata fields: ${error}` },
      { status: 500 },
    );
  }
}
