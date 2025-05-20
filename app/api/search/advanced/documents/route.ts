import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import { NextResponse } from "next/server";

const fetchSearchAdvancedDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/search/advanced/documents`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export async function GET() {
  try {
    const data: AdvancedSearchDocument[] = await fetchSearchAdvancedDocuments();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch advanced search documents: ${error}` },
      { status: 500 },
    );
  }
}
