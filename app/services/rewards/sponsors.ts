import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { SponsorsResponse } from "@/app/types/rewards/sponsors";

export async function fetchSponsors(params?: {
  per_page?: number;
}): Promise<SponsorsResponse> {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}${ENDPOINTS.sponsors}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<SponsorsResponse>;
}
