import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import {
  LeaderboardEntry,
  LeaderboardParams,
  LeaderboardResponse,
} from "@/app/types/rewards/leaderboards";

export async function fetchLeaderboards(
  params?: LeaderboardParams,
): Promise<LeaderboardResponse> {
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

  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchLeaderboardEntry(
  userId: string,
  grantId?: string,
  sponsorSlug?: string,
): Promise<LeaderboardEntry> {
  const searchParams = new URLSearchParams();
  if (grantId) {
    searchParams.append("grant_id", grantId);
  }
  if (sponsorSlug) {
    searchParams.append("sponsor_slug", sponsorSlug);
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}${ENDPOINTS.leaderboards}/${userId}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
