import { aggregateChartData, formatChartDate } from "@/app/lib/utils";
import { ChartSeries, DataPointDefinition } from "@/app/types/index/chart";
import { StatsDataPoint } from "@/app/types/stats";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

export function useChartMetrics() {
  return useSuspenseQuery<DataPointDefinition[]>({
    queryKey: ["chartMetrics"],
    queryFn: () =>
      axios.get(`/api/stats/daily/metrics`).then((res) => res.data),
  });
}

export function useDailyStats(props: {
  series: ChartSeries;
  date_from?: string;
  date_to?: string;
}) {
  const { series, date_from, date_to } = props;

  return useSuspenseQuery<Record<string, StatsDataPoint[]>>({
    queryKey: ["dailyStats", series, date_from, date_to],
    queryFn: async () => {
      const allSeriesItems = [...series.left, ...series.right];

      if (allSeriesItems.length === 0) {
        return {};
      }

      const promises = allSeriesItems.map(async (seriesItem) => {
        const requestBody = {
          metrics: [seriesItem.key],
          cumulative: seriesItem.cumulative,
          ...(date_from && { date_from }),
          ...(date_to && { date_to }),
        };

        const encodedQuery = encodeURIComponent(JSON.stringify(requestBody));

        const response = await axios.get(`/api/stats/daily?q=${encodedQuery}`);

        return { metric: seriesItem.key, data: response.data };
      });

      const results = await Promise.all(promises);

      const combinedData: Record<string, StatsDataPoint[]> = {};

      results.forEach(({ metric, data }) => {
        const metricData = data[metric] || [];

        const sortedData = metricData.sort(
          (a: StatsDataPoint, b: StatsDataPoint) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          },
        );

        combinedData[metric] = sortedData;
      });

      return combinedData;
    },
  });
}

export function useChartData(props: {
  series: ChartSeries;
  date_from?: string;
  date_to?: string;
  interval?: string;
}) {
  const { data: dailyStatsData } = useDailyStats(props);

  const chartData = useMemo(() => {
    if (!dailyStatsData) return [];

    const allDates = new Set<string>();
    Object.values(dailyStatsData).forEach((dataPoints) => {
      dataPoints.forEach((point) => allDates.add(point.date));
    });

    const dates = Array.from(allDates);
    const allSeriesItems = [...props.series.left, ...props.series.right];

    const dailyData = dates.map((date) => {
      const chartPoint: Record<string, string | number> = {
        date: formatChartDate(date),
      };

      allSeriesItems.forEach((seriesItem) => {
        const metricData = dailyStatsData[seriesItem.key] || [];
        const dataPoint = metricData.find((point) => point.date === date);
        chartPoint[seriesItem.key] = dataPoint
          ? parseFloat(dataPoint.count)
          : 0;
      });

      return chartPoint;
    });

    // Apply aggregation based on the interval
    const interval = props.interval || "d";

    // Identify cumulative fields
    const cumulativeFields = new Set<string>();
    allSeriesItems.forEach((seriesItem) => {
      if (seriesItem.cumulative) {
        cumulativeFields.add(seriesItem.key);
      }
    });

    return aggregateChartData(dailyData, interval, cumulativeFields);
  }, [dailyStatsData, props.series, props.interval]);

  return chartData;
}
