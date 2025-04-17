"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";

interface WinnersProfileChartProps {
  data: CSVRow[];
}

// Define the shape of our data
interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

// Define custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

// Combined experience data item type
interface CombinedExperienceItem {
  name: string;
  value: number;
  percentage: number;
  years: number;
  githubValue: number;
  onchainValue: number;
}

export default function WinnersProfileChart({ data }: WinnersProfileChartProps) {
  const { isDarkMode } = useTheme();

  // Process builder score data
  const builderScoreData = data
    .filter(row => row["Category"] === "Builder Score")
    .map(row => ({
      name: String(row["Metric"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage"])
    }))
    .sort((a, b) => {
      // Extract the level number for sorting (e.g., "Level 1 (Novice)" -> 1)
      const getLevel = (name: string) => parseInt(name.match(/Level (\d+)/)?.[1] || "0");
      return getLevel(a.name) - getLevel(b.name);
    });

  // Process GitHub experience data
  const githubExpData = data
    .filter(row => row["Category"] === "GitHub Experience" && row["Metric"] !== "No data")
    .map(row => {
      const yearLabel = row["Metric"] as string;
      return {
        name: yearLabel,
        value: Number(row["Count"]),
        percentage: Number(row["Percentage"]),
        // For sorting: convert "10+ years" to number 10
        years: yearLabel.includes("+") 
          ? parseInt(yearLabel.split(" ")[0]) 
          : parseInt(yearLabel.split(" ")[0])
      };
    })
    .sort((a, b) => a.years - b.years);

  // Process onchain experience data
  const onchainExpData = data
    .filter(row => row["Category"] === "Onchain Experience" && row["Metric"] !== "No data" && Number(row["Count"]) > 0)
    .map(row => {
      const yearLabel = row["Metric"] as string;
      return {
        name: yearLabel,
        value: Number(row["Count"]),
        percentage: Number(row["Percentage"]),
        years: parseInt(yearLabel.split(" ")[0])
      };
    })
    .sort((a, b) => a.years - b.years);

  // Get no data counts
  const githubNoData = data.find(row => 
    row["Category"] === "GitHub Experience" && row["Metric"] === "No data"
  );
  const onchainNoData = data.find(row => 
    row["Category"] === "Onchain Experience" && row["Metric"] === "No data"
  );
  
  const githubNoDataCount = githubNoData ? Number(githubNoData["Count"]) : 0;
  const onchainNoDataCount = onchainNoData ? Number(onchainNoData["Count"]) : 0;
  
  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  // Colors for the charts
  const COLORS_BUILDER_SCORE = [
    '#FF6B6B', '#FF9E7A', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'
  ];
  
  const COLORS_EXPERIENCE = {
    github: '#8884d8',
    onchain: '#82ca9d'
  };

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartData;
      return (
        <div className={`p-2 ${isDarkMode ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-800'} border ${isDarkMode ? 'border-neutral-600' : 'border-neutral-300'} rounded shadow-md`}>
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`Count: ${data.value}`}</p>
          <p className="text-sm">{`Percentage: ${data.percentage.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Builder Score Section */}
      <Card className={`${cardBg} border-0`}>
        <CardHeader className="pb-2">
          <CardTitle className={textColor}>Winners Profile: Builder Score</CardTitle>
          <CardDescription className={descColor}>
            Distribution of winners by builder score level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col md:flex-row items-center justify-center">
            {/* Builder Score Pie Chart */}
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={builderScoreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {builderScoreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_BUILDER_SCORE[index % COLORS_BUILDER_SCORE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry, index) => (
                      <span className={isDarkMode ? "text-white" : "text-neutral-800"}>
                        {value} ({builderScoreData[index]?.value})
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Years of Experience Section */}
      <Card className={`${cardBg} border-0`}>
        <CardHeader className="pb-2">
          <CardTitle className={textColor}>Winners Profile: Years of Experience</CardTitle>
          <CardDescription className={descColor}>
            Distribution of winners by years of experience (GitHub vs. Onchain)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {/* Experience Distribution Chart */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  ...githubExpData.map(item => ({
                    ...item,
                    githubValue: item.value,
                    onchainValue: 0,
                  })),
                  ...onchainExpData.map(item => ({
                    ...item,
                    githubValue: 0,
                    onchainValue: item.value,
                  }))
                ].reduce((result, item) => {
                  // Combine data with the same years
                  const existingItem = result.find(r => r.name === item.name);
                  if (existingItem) {
                    existingItem.githubValue = item.githubValue || existingItem.githubValue;
                    existingItem.onchainValue = item.onchainValue || existingItem.onchainValue;
                  } else {
                    result.push(item);
                  }
                  return result;
                }, [] as CombinedExperienceItem[]).sort((a, b) => {
                  // Sort by years (special handling for "10+ years")
                  const getYears = (name: string) => {
                    if (name.includes("+")) return parseInt(name.split(" ")[0]);
                    return parseInt(name.split(" ")[0]);
                  };
                  return getYears(a.name) - getYears(b.name);
                })}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  stroke={isDarkMode ? "#aaa" : "#666"}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  stroke={isDarkMode ? "#aaa" : "#666"}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'githubValue') return [value, 'GitHub Users'];
                    if (name === 'onchainValue') return [value, 'Onchain Users'];
                    return [value, name];
                  }}
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                    color: isDarkMode ? "#fff" : "#333",
                    border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`
                  }}
                />
                <Legend 
                  formatter={(value) => {
                    if (value === 'githubValue') 
                      return `GitHub Experience${githubNoDataCount > 0 ? ` (${githubNoDataCount} no data)` : ''}`;
                    if (value === 'onchainValue') 
                      return `Onchain Experience${onchainNoDataCount > 0 ? ` (${onchainNoDataCount} no data)` : ''}`;
                    return value;
                  }}
                />
                <Bar dataKey="githubValue" name="githubValue" fill={COLORS_EXPERIENCE.github} />
                <Bar dataKey="onchainValue" name="onchainValue" fill={COLORS_EXPERIENCE.onchain} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 