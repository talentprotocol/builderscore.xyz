import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";

export async function fetchSponsors(): Promise<SponsorsResponse> {
  const url = `${API_BASE_URL}${ENDPOINTS.sponsors}`;

  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<SponsorsResponse>;
}
