import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { DataPointDefinition } from "@/app/types/index/chart";
import { NextResponse } from "next/server";

const fetchStatsDailyMetrics = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/daily/metrics`, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export async function GET() {
  try {
    const data: DataPointDefinition[] = await fetchStatsDailyMetrics();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stats daily metrics: ${error}` },
      { status: 500 },
    );
  }
}
