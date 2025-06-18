import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { AdvancedSearchMetadataField } from "@/app/types/advancedSearchMetadataFields";
import axios, { AxiosError } from "axios";

export const fetchSearchAdvancedMetadataFields = unstable_cache(
  async ({
    documents,
  }: {
    documents: string;
  }): Promise<AdvancedSearchMetadataField[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/search/advanced/metadata/fields/${documents}/default`,
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
  [CACHE_TAGS.SEARCH_FIELDS],
  { revalidate: CACHE_60_MINUTES },
);
