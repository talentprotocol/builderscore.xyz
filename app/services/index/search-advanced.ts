import {
  API_BASE_URL,
  DEBUG_VIEW_UNLOCK_WORD,
  DEFAULT_HEADERS,
} from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import axios, { AxiosError } from "axios";

export const fetchSearchAdvanced = unstable_cache(
  async ({
    documents,
    queryString,
  }: {
    documents: string;
    queryString: string;
  }) => {
    let processedQueryString = queryString;
    if (queryString.includes("debug=true")) {
      processedQueryString = queryString.replace(
        "debug=true",
        `debug=${DEBUG_VIEW_UNLOCK_WORD}`,
      );
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/search/advanced/${documents}?${processedQueryString}`,
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
  [CACHE_TAGS.SEARCH_ADVANCED],
  { revalidate: CACHE_60_MINUTES },
);
