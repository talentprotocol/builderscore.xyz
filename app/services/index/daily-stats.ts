import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";

export const fetchDailyStatsData = async (queryString: string) => {
  const response = await fetch(`${API_BASE_URL}/stats/daily?${queryString}`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
