"use client";

import { useDebouncedCallback } from "@/app/hooks/useDebouncedCallback";
import {
  CHART_DATAPOINTS_KEY,
  chartDatapointsParser,
} from "@/app/lib/data-table/parsers";
import { StatsDataPoint } from "@/app/types/stats";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

interface ChartDataPoint {
  id: string;
  dataIssuer: string;
  dataPoint: string;
}

interface UseChartDataProps {
  datapoints?: ChartDataPoint[];
  dateRange?: {
    from: string | Date;
    to: string | Date;
  };
  initialData?: Record<string, StatsDataPoint[]>;
  debounceMs?: number;
  throttleMs?: number;
}

interface ChartData {
  chartData: Record<string, StatsDataPoint[]>;
  isLoading: boolean;
  error: Error | null;
}

export function useChartData({
  datapoints = [],
  dateRange,
  initialData = {},
  debounceMs = 300,
}: UseChartDataProps) {
  const searchParams = useSearchParams();
  const chartDatapointsStr = searchParams.get(CHART_DATAPOINTS_KEY);
  const chartDateRangeStr = searchParams.get("chartDateRange");

  const effectiveDatapoints = useMemo(() => {
    const urlDatapoints = chartDatapointsStr
      ? chartDatapointsParser.parse(chartDatapointsStr) || []
      : [];

    return datapoints.length > 0 ? datapoints : urlDatapoints;
  }, [datapoints, chartDatapointsStr]);

  const effectiveDateRange = useMemo(() => {
    if (dateRange) return dateRange;

    if (chartDateRangeStr) {
      try {
        const parsed = JSON.parse(chartDateRangeStr);
        return {
          from: parsed.from,
          to: parsed.to,
        };
      } catch {
        // Fall back to default if parsing fails
      }
    }

    // Default 30-day range if no date range is provided
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    return {
      from: oneMonthAgo.toISOString(),
      to: now.toISOString(),
    };
  }, [dateRange, chartDateRangeStr]);

  const chartData = useMemo<ChartData>(
    () => ({
      chartData: initialData,
      isLoading: false,
      error: null,
    }),
    [initialData],
  );

  const debouncedDataRequest = useDebouncedCallback(() => {}, debounceMs);

  useEffect(() => {
    if (effectiveDatapoints.length === 0) {
      return;
    }

    // No need to calculate date ranges from individual datapoints anymore
    // Just use the effectiveDateRange directly

    debouncedDataRequest();
  }, [effectiveDatapoints, effectiveDateRange, debouncedDataRequest]);

  return chartData;
}
