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
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface UseChartDataProps {
  datapoints?: ChartDataPoint[];
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
  initialData = {},
  debounceMs = 300,
}: UseChartDataProps) {
  const searchParams = useSearchParams();
  const chartDatapointsStr = searchParams.get(CHART_DATAPOINTS_KEY);

  const effectiveDatapoints = useMemo(() => {
    const urlDatapoints = chartDatapointsStr
      ? chartDatapointsParser.parse(chartDatapointsStr) || []
      : [];

    return datapoints.length > 0 ? datapoints : urlDatapoints;
  }, [datapoints, chartDatapointsStr]);

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

    let earliestFrom: Date | undefined;
    let latestTo: Date | undefined;

    effectiveDatapoints.forEach((dp) => {
      if (dp.dateRange.from) {
        const fromDate =
          dp.dateRange.from instanceof Date
            ? dp.dateRange.from
            : new Date(dp.dateRange.from);

        if (!earliestFrom || fromDate < earliestFrom) {
          earliestFrom = fromDate;
        }
      }

      if (dp.dateRange.to) {
        const toDate =
          dp.dateRange.to instanceof Date
            ? dp.dateRange.to
            : new Date(dp.dateRange.to);

        if (!latestTo || toDate > latestTo) {
          latestTo = toDate;
        }
      }
    });

    debouncedDataRequest();
  }, [effectiveDatapoints, debouncedDataRequest]);

  return chartData;
}
