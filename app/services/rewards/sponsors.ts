import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";
import axios, { AxiosError } from "axios";

export const fetchSponsors = unstable_cache(
  async (): Promise<SponsorsResponse> => {
    const url = `${API_BASE_URL}${ENDPOINTS.sponsors}`;

    try {
      const response = await axios.get(url, {
        headers: DEFAULT_HEADERS,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.SPONSORS],
  { revalidate: CACHE_60_MINUTES },
);
