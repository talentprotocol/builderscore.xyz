import { fetchChartMetrics } from "@/app/services/index/chart-metrics";
import { DataPointDefinition } from "@/app/types/index/chart";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data: DataPointDefinition[] = await fetchChartMetrics();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stats daily metrics: ${error}` },
      { status: 500 },
    );
  }
}
