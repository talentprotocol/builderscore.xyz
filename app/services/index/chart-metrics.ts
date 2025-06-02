import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { DataPointDefinition } from "@/app/types/index/chart";

export const fetchChartMetrics = async (): Promise<DataPointDefinition[]> => {
  const response = await fetch(`${API_BASE_URL}/stats/daily/metrics`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
