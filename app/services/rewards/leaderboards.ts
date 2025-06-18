import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  LeaderboardEntry,
  LeaderboardParams,
  LeaderboardResponse,
} from "@/app/types/rewards/leaderboards";
import axios, { AxiosError } from "axios";

export const fetchLeaderboards = unstable_cache(
  async (params?: LeaderboardParams): Promise<LeaderboardResponse> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${ENDPOINTS.leaderboards}${queryString ? `?${queryString}` : ""}`;

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
  [CACHE_TAGS.LEADERBOARDS],
  { revalidate: CACHE_60_MINUTES },
);

export const fetchLeaderboardEntry = unstable_cache(
  async (
    userId: string,
    grantId?: string,
    sponsorSlug?: string,
  ): Promise<LeaderboardEntry> => {
    const searchParams = new URLSearchParams();
    if (grantId) {
      searchParams.append("grant_id", grantId);
    }
    if (sponsorSlug) {
      searchParams.append("sponsor_slug", sponsorSlug);
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}${ENDPOINTS.leaderboards}/${userId}${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axios.get(url, {
        headers: DEFAULT_HEADERS,
      });

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;

      if (error.response?.status === 404) {
        throw new Error("NOT_FOUND");
      }

      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.LEADERBOARD_BY_ID],
  { revalidate: CACHE_60_MINUTES },
);
