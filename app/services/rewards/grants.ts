import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { GrantParams, GrantsResponse } from "@/app/types/rewards/grants";
import axios, { AxiosError } from "axios";

export const fetchGrants = unstable_cache(
  async (params?: GrantParams): Promise<GrantsResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${ENDPOINTS.grants}${queryString ? `?${queryString}` : ""}`;

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
  [CACHE_TAGS.GRANTS],
  { revalidate: CACHE_60_MINUTES },
);
