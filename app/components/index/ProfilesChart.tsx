"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { formatChartDate } from "@/app/lib/utils";
import {
  CartesianGrid,
  Dot,
  DotProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProfileData {
  date: string;
  count: number;
}

interface ProfilesData {
  base_basename: ProfileData[];
  ens: ProfileData[];
  farcaster: ProfileData[];
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

export default function ProfilesChart() {
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    base_basename: "var(--chart-1)",
    ens: "var(--chart-2)",
    farcaster: "var(--chart-3)",
  };

  const simulatedData: ProfilesData = {
    base_basename: [
      { date: "2025-05-02", count: 0 },
      { date: "2025-05-01", count: 0 },
      { date: "2025-04-30", count: 296 },
      { date: "2025-04-29", count: 0 },
      { date: "2025-04-28", count: 279 },
      { date: "2025-04-27", count: 312 },
      { date: "2025-04-26", count: 185 },
      { date: "2025-04-25", count: 234 },
      { date: "2025-04-24", count: 156 },
      { date: "2025-04-23", count: 298 },
    ],
    ens: [
      { date: "2025-05-02", count: 12 },
      { date: "2025-05-01", count: 8 },
      { date: "2025-04-30", count: 45 },
      { date: "2025-04-29", count: 23 },
      { date: "2025-04-28", count: 67 },
      { date: "2025-04-27", count: 34 },
      { date: "2025-04-26", count: 29 },
      { date: "2025-04-25", count: 52 },
      { date: "2025-04-24", count: 41 },
      { date: "2025-04-23", count: 38 },
    ],
    farcaster: [
      { date: "2025-05-02", count: 156 },
      { date: "2025-05-01", count: 134 },
      { date: "2025-04-30", count: 178 },
      { date: "2025-04-29", count: 167 },
      { date: "2025-04-28", count: 145 },
      { date: "2025-04-27", count: 189 },
      { date: "2025-04-26", count: 123 },
      { date: "2025-04-25", count: 198 },
      { date: "2025-04-24", count: 176 },
      { date: "2025-04-23", count: 201 },
    ],
  };

  const dailyChartData = simulatedData.base_basename
    .map((item, index) => ({
      date: formatChartDate(item.date),
      base_basename: item.count,
      ens: simulatedData.ens[index]?.count || 0,
      farcaster: simulatedData.farcaster[index]?.count || 0,
    }))
    .reverse();

  const CustomCursor = (props: {
    stroke?: string;
    points?: { x: number; y: number }[];
    width?: number;
    height?: number;
  }) => {
    const { points } = props;
    if (!points) return null;

    return (
      <>
        {/* Vertical line */}
        <line
          stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
          strokeWidth={0.5}
          x1={points[0].x}
          y1={points[0].y}
          x2={points[0].x}
          y2={points[1].y}
        />
      </>
    );
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  }) => {
    if (!active || !payload) return null;

    return (
      <div className="tooltip-style px-2 py-1">
        <p className="mb-1 text-xs font-medium">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-[3px] w-2"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-xs">
                <span className="font-medium">{entry.name}: </span>
                <span className="font-semibold">{entry.value}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CustomActiveDot = (props: DotProps) => {
    const { cx, cy } = props;
    return (
      <>
        <line
          stroke="white"
          strokeWidth={0.5}
          strokeDasharray="1 2"
          x1={60}
          y1={cy}
          x2={10000}
          y2={cy}
        />
        <Dot
          cx={cx}
          cy={cy}
          r={4}
          fill={CHART_COLORS.base_basename}
          stroke="white"
          strokeWidth={2}
        />
      </>
    );
  };

  const renderChart = (data: typeof dailyChartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeWidth={0.25}
          stroke={isDarkMode ? "#444" : "#eee"}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10 }}
          stroke={isDarkMode ? "#aaa" : "#666"}
          dy={10}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, "auto"]}
          tick={{ fontSize: 10 }}
          stroke={isDarkMode ? "#aaa" : "#666"}
          axisLine={false}
          tickLine={false}
          width={60}
          label={{
            value: "Profiles",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 10 },
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={<CustomCursor />}
          formatter={(value, name) => {
            const nameMap: { [key: string]: string } = {
              base_basename: "Base Basename",
              ens: "ENS",
              farcaster: "Farcaster",
            };
            return [value, nameMap[name as string] || name];
          }}
          itemStyle={{
            paddingTop: 6,
            paddingBottom: 0,
          }}
        />
        <Legend
          wrapperStyle={{
            fontSize: 10,
            paddingBottom: 30,
            textAlign: "left",
          }}
          verticalAlign="top"
          align="left"
          content={({ payload }) => (
            <div style={{ display: "flex", gap: "15px", fontSize: 10 }}>
              {payload?.map((entry, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 3,
                      backgroundColor: entry.color,
                    }}
                  />
                  <span style={{ color: isDarkMode ? "#fff" : "#333" }}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        />
        <Line
          type="linear"
          dataKey="base_basename"
          stroke={CHART_COLORS.base_basename}
          name="Base Basename"
          strokeWidth={3}
          strokeLinejoin="round"
          isAnimationActive={false}
          dot={false}
          activeDot={<CustomActiveDot />}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="card-style px-3 pt-2 pb-4">
      <div className="h-[300px]">{renderChart(dailyChartData)}</div>
    </div>
  );
}
