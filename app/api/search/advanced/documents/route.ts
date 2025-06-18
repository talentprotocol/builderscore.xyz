import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import axios, { AxiosError } from "axios";
import { NextResponse } from "next/server";

const fetchSearchAdvancedDocuments = unstable_cache(
  async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search/advanced/documents`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;

      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.SEARCH_DOCUMENTS],
  { revalidate: CACHE_60_MINUTES },
);

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
