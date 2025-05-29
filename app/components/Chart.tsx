"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { DataPoint } from "@/app/types/index/chart";
import {
  Area,
  Bar,
  BarProps,
  CartesianGrid,
  ComposedChart,
  Dot,
  DotProps,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartType = "line" | "column" | "stacked-column" | "area";

interface ChartConfig {
  key: string;
  name: string;
  color: string;
  type: ChartType;
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface LegendPayload {
  color?: string;
  value: string;
  type?: string;
  id?: string;
}

interface ChartProps {
  data: DataPoint[];
  series: {
    left?: ChartConfig[];
    right?: ChartConfig[];
  };
  xAxisKey: string;
  yAxisLabel?: {
    left?: string;
    right?: string;
  };
  yAxisWidth?: number;
  height?: number | string;
}

export default function Chart({
  data,
  series,
  xAxisKey,
  yAxisLabel = {},
  yAxisWidth = 50,
  height = "100%",
}: ChartProps) {
  const { isDarkMode } = useTheme();

  const CustomCursor = (props: {
    stroke?: string;
    points?: { x: number; y: number }[];
    width?: number;
    height?: number;
  }) => {
    const { points } = props;
    if (!points) return null;

    return (
      <line
        stroke={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}
        strokeWidth={0.5}
        x1={points[0].x}
        y1={points[0].y}
        x2={points[0].x}
        y2={points[1].y}
      />
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

  const getLineEndX = () => {
    return `calc(100% - ${series.right ? yAxisWidth : 0}px)`;
  };

  const CustomActiveDot = (props: DotProps & { color: string }) => {
    const { cx, cy, color } = props;
    return (
      <>
        <line
          stroke="white"
          strokeWidth={0.5}
          strokeDasharray="1 2"
          x1={yAxisWidth}
          y1={cy}
          x2={getLineEndX()}
          y2={cy}
        />
        <Dot
          cx={cx}
          cy={cy}
          r={3}
          fill={color}
          stroke="white"
          strokeWidth={1}
        />
      </>
    );
  };

  const CustomActiveBar = (props: BarProps & { color: string }) => {
    const { x, y, width, height, color } = props;
    return <rect x={x} y={y} width={width} height={height} fill={color} />;
  };

  const CustomLegend = ({ payload }: { payload?: LegendPayload[] }) => (
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
  );

  const commonProps = {
    data,
    margin: { top: 0, right: 0, left: 0, bottom: 0 },
  };

  const getYAxis = (orientation: "left" | "right") => (
    <YAxis
      yAxisId={orientation}
      orientation={orientation}
      domain={[0, "auto"]}
      tick={{ fontSize: 10 }}
      stroke={isDarkMode ? "#aaa" : "#666"}
      axisLine={false}
      tickLine={false}
      width={yAxisWidth}
      label={
        yAxisLabel[orientation]
          ? {
              value: yAxisLabel[orientation],
              angle: orientation === "left" ? -90 : 90,
              position: orientation === "left" ? "insideLeft" : "insideRight",
              style: { textAnchor: "middle", fontSize: 10 },
            }
          : undefined
      }
    />
  );

  const commonAxisProps = {
    xAxis: (
      <XAxis
        dataKey={xAxisKey}
        tick={{ fontSize: 10 }}
        stroke={isDarkMode ? "#aaa" : "#666"}
        dy={10}
        axisLine={false}
        tickLine={false}
      />
    ),
    cartesianGrid: (
      <CartesianGrid
        strokeWidth={0.25}
        stroke={isDarkMode ? "#444" : "#eee"}
        vertical={false}
      />
    ),
    tooltip: (
      <Tooltip
        content={<CustomTooltip />}
        cursor={<CustomCursor />}
        itemStyle={{
          paddingTop: 6,
          paddingBottom: 0,
        }}
      />
    ),
    legend: (
      <Legend
        wrapperStyle={{
          fontSize: 10,
          paddingBottom: 30,
          textAlign: "left",
        }}
        verticalAlign="top"
        align="left"
        content={CustomLegend}
      />
    ),
  };

  const renderSeries = (
    configs: ChartConfig[] | undefined,
    yAxisId: "left" | "right",
  ) => {
    if (!configs) return null;

    return configs.map((config) => {
      switch (config.type) {
        case "area":
          return (
            <Area
              key={config.key}
              yAxisId={yAxisId}
              activeDot={<CustomActiveDot color={config.color} />}
              dataKey={config.key}
              fill={config.color}
              fillOpacity={0.2}
              name={config.name}
              stroke={config.color}
              strokeLinejoin="round"
              strokeWidth={3}
              type="linear"
            />
          );
        case "line":
          return (
            <Line
              key={config.key}
              yAxisId={yAxisId}
              activeDot={<CustomActiveDot color={config.color} />}
              dataKey={config.key}
              dot={false}
              isAnimationActive={false}
              name={config.name}
              stroke={config.color}
              strokeLinejoin="round"
              strokeWidth={3}
              type="linear"
            />
          );
        case "column":
          return (
            <Bar
              key={config.key}
              yAxisId={yAxisId}
              activeBar={
                <CustomActiveBar color={config.color} dataKey={config.key} />
              }
              dataKey={config.key}
              fill={config.color}
              name={config.name}
            />
          );
        case "stacked-column":
          return (
            <Bar
              key={config.key}
              yAxisId={yAxisId}
              activeBar={
                <CustomActiveBar color={config.color} dataKey={config.key} />
              }
              dataKey={config.key}
              fill={config.color}
              name={config.name}
              stackId={`stack-${yAxisId}`}
            />
          );
      }
    });
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart {...commonProps} barCategoryGap={2}>
        {commonAxisProps.cartesianGrid}
        {commonAxisProps.xAxis}
        {series.left && getYAxis("left")}
        {series.right && getYAxis("right")}
        {commonAxisProps.tooltip}
        {commonAxisProps.legend}
        {renderSeries(series.left, "left")}
        {renderSeries(series.right, "right")}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
