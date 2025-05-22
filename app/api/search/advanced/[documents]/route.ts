import {
  API_BASE_URL,
  DEFAULT_HEADERS,
  DEBUG_VIEW_UNLOCK_WORD,
} from "@/app/config/api";
import { AdvancedSearchMetadataField } from "@/app/types/advancedSearchMetadataFields";
import { NextRequest, NextResponse } from "next/server";

const fetchSearchAdvanced = async ({
  documents,
  queryString,
}: {
  documents: string;
  queryString: string;
}) => {
  if (queryString.includes("debug=true")) {
    queryString = queryString.replace(
      "debug=true",
      `debug=${DEBUG_VIEW_UNLOCK_WORD}`,
    );
  }
  const response = await fetch(
    `${API_BASE_URL}/search/advanced/${documents}?${queryString}`,
    {
      method: "GET",
      headers: DEFAULT_HEADERS,
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

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
