"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { formatDate } from "@/app/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

interface ActivityChartProps {
  dailyData: CSVRow[];
  weeklyData: CSVRow[];
}

export default function ActivityChart({ dailyData, weeklyData }: ActivityChartProps) {
  const { isDarkMode } = useTheme();

  const CHART_COLORS = {
    activationRate: "var(--chart-1)",
    eligibleBuilders: "var(--chart-2)",
    activeBuilders: "var(--chart-3)" 
  };
  
  const filteredDailyData = dailyData.filter(row => 
    Number(row["New Eligible Devs"]) > 0 || 
    Number(row["Active Devs"]) > 0
  );

  const dailyChartData = filteredDailyData.map(row => {
    const dateStr = row["Date"] as string;
    return {
      date: formatDate(dateStr),
      newEligibleBuilders: Number(row["New Eligible Devs"]),
      activeBuilders: Number(row["Active Devs"]),
      activationRate: Number(row["Activation Rate (%)"])
    };
  });

  const weeklyChartData = weeklyData.map(row => {
    const dateStr = row["Week Start Date (Monday)"] as string;
    return {
      date: formatDate(dateStr),
      newEligibleBuilders: Number(row["New Eligible Devs"]),
      activeBuilders: Number(row["Active Devs"]),
      activationRate: Number(row["Activation Rate (%)"])
    };
  });

  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";
  const tabBgClass = isDarkMode ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-800";
  const tabItemClass = isDarkMode
    ? "bg-neutral-900 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
    : "bg-neutral-200 hover:bg-white data-[state=active]:bg-white text-neutral-800";

  const renderChart = (data: typeof dailyChartData) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }} 
          stroke={isDarkMode ? "#aaa" : "#666"}
          dy={10}
        />
        <YAxis 
          yAxisId="left" 
          domain={[0, 'auto']} 
          tick={{ fontSize: 12 }} 
          stroke={isDarkMode ? "#aaa" : "#666"}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 'auto']} 
          tick={{ fontSize: 12 }} 
          stroke={isDarkMode ? "#aaa" : "#666"}
          tickFormatter={(value) => {
            return `${value}%`;
          }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
            fontSize: 12
          }}
          formatter={(value, name) => {
            if (name === "Activation Rate %") {
              return [`${typeof value === 'number' ? value.toFixed(2) : value}%`, "Activation Rate"];
            }
            
            if (name === "Eligible Builders") {
              return [value, "Eligible Builders"];
            }

            if (name === "Active Builders") {
              return [value, "Active Builders"];
            }
          }}
          itemStyle={{
            paddingTop: 6,
            paddingBottom: 0
          }}
        />
        <Legend 
          wrapperStyle={{ 
            fontSize: 11,
            paddingTop: 15
          }}
        />
        <Line 
          yAxisId="right" 
          type="linear"
          dataKey="activationRate" 
          stroke={CHART_COLORS.activationRate} 
          activeDot={{ r: 6 }} 
          name="Activation Rate %" 
          strokeWidth={1}
          isAnimationActive={false}
        />
        <Line 
          yAxisId="left" 
          type="linear" 
          dataKey="newEligibleBuilders" 
          stroke={CHART_COLORS.eligibleBuilders} 
          name="Eligible Builders" 
          strokeWidth={1}
          isAnimationActive={false}
        />
        <Line 
          yAxisId="left" 
          type="linear" 
          dataKey="activeBuilders" 
          stroke={CHART_COLORS.activeBuilders} 
          name="Active Builders" 
          strokeWidth={1}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className={cardClass}>
      <Tabs defaultValue="daily" className="w-full relative">
        <div className="sm:mb-4">
          <div className={`font-semibold mb-1 ${textColor}`}>
            Builder Activity
          </div>
          <div className={`text-xs ${descColor}`}>
            New eligible Builders, active Builders, and activation rate
          </div>
        </div>

        <TabsList className={`mb-3 sm:absolute top-0 right-0 ${tabBgClass}`}>
          <TabsTrigger
            className={`text-xs cursor-pointer mr-0.5 ${tabItemClass}`}
            value="daily"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            className={`text-xs cursor-pointer ${tabItemClass}`}
            value="weekly"
          >
            Weekly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-0">
          <div className="h-[300px]">{renderChart(dailyChartData)}</div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-0">
          <div className="h-[300px]">{renderChart(weeklyChartData)}</div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 