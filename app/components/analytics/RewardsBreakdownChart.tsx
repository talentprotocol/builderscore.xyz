"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";
import { useState } from "react";

interface RewardsBreakdownChartProps {
  data: CSVRow[];
}

// Define the shape of our data
interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

// Define types for our custom components
interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
  [key: string]: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export default function RewardsBreakdownChart({ data }: RewardsBreakdownChartProps) {
  const { isDarkMode } = useTheme();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Get the total from the data
  const totalRow = data.find(row => row["Category"] === "Total Rewarded Users");
  const totalCount = totalRow ? Number(totalRow["Count"]) : 0;
  
  // Prepare recipient type data (one-time vs repeated)
  const recipientTypeData = data
    .filter(row => 
      row["Category"] === "Builder Rewards (one-time)" || 
      row["Category"] === "Builder Rewards (repeated recipient)"
    )
    .map(row => ({
      name: String(row["Category"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage of Total"])
    }));

  // Prepare special categories data (base-builds and buildathon)
  const specialCategoriesData = data
    .filter(row => 
      row["Category"] === "BR + /base-builds" || 
      row["Category"] === "BR + Buildathon Winner"
    )
    .map(row => ({
      name: String(row["Category"]),
      value: Number(row["Count"]),
      percentage: Number(row["Percentage of Total"])
    }));
  
  // Calculate the number of non-special receivers (total - special categories)
  const specialCount = specialCategoriesData.reduce((sum, item) => sum + item.value, 0);
  const nonSpecialCount = totalCount - specialCount;
  const nonSpecialPercentage = (nonSpecialCount / totalCount) * 100;
  
  // Add non-special receivers to the special categories data
  const enhancedSpecialData = [
    ...specialCategoriesData,
    {
      name: "No Special Recognition",
      value: nonSpecialCount,
      percentage: nonSpecialPercentage
    }
  ];
  
  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";
  const buttonBg = isDarkMode ? "bg-neutral-700 hover:bg-neutral-600" : "bg-neutral-200 hover:bg-neutral-300";
  const activeBg = isDarkMode ? "bg-neutral-600" : "bg-neutral-300";

  // Colors for the charts
  const COLORS_RECIPIENTS = ['#8884d8', '#82ca9d'];
  const COLORS_SPECIAL = ['#ffc658', '#ff7300', '#aaaaaa'];

  // Custom renderer for the pie chart labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: CustomLabelProps) => {
    if (!cx || !cy || !midAngle || !outerRadius || !percent) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = Number(outerRadius) * 1.1;
    const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN);
    const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN);
    
    // Shorten the label if needed
    let displayName = name;
    if (name.includes("BR + ")) {
      displayName = name.replace("BR + ", "");
    } else if (name.includes("Builder Rewards ")) {
      displayName = name.replace("Builder Rewards ", "");
    }
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDarkMode ? "#ddd" : "#333"}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${displayName} (${(Number(percent) * 100).toFixed(1)}%)`}
      </text>
    );
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
    <Card className={`${cardBg} border-0`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={textColor}>Rewards Breakdown</CardTitle>
          <div className="flex rounded-md overflow-hidden text-xs">
            <button 
              onClick={() => setChartType('pie')} 
              className={`px-2 py-1 ${chartType === 'pie' ? activeBg : buttonBg} ${textColor}`}
            >
              Pie Charts
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`px-2 py-1 ${chartType === 'bar' ? activeBg : buttonBg} ${textColor}`}
            >
              Bar Chart
            </button>
          </div>
        </div>
        <CardDescription className={descColor}>
          <div className="flex flex-col space-y-1">
            <span>Breakdown of rewards recipients by category</span>
            <div className="text-sm mt-2">
              <span>Total Rewarded Users: {totalCount.toLocaleString()}</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartType === 'pie' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First pie chart: One-time vs Repeated Recipients */}
            <div className="h-[350px]">
              <h3 className={`${textColor} text-center text-sm font-medium mb-2`}>One-time vs. Repeated Recipients</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={recipientTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {recipientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_RECIPIENTS[index % COLORS_RECIPIENTS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value, entry, index) => (
                      <span className={isDarkMode ? "text-white" : "text-neutral-800"}>
                        {value.replace("Builder Rewards ", "")} ({recipientTypeData[index]?.value} users)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Second pie chart: Special Categories */}
            <div className="h-[350px]">
              <h3 className={`${textColor} text-center text-sm font-medium mb-2`}>Special Recognition Categories</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enhancedSpecialData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {enhancedSpecialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SPECIAL[index % COLORS_SPECIAL.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    formatter={(value, entry, index) => {
                      const name = enhancedSpecialData[index]?.name;
                      const count = enhancedSpecialData[index]?.value;
                      return (
                        <span className={isDarkMode ? "text-white" : "text-neutral-800"}>
                          {name.includes("BR + ") ? name.replace("BR + ", "") : name} ({count} users)
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...recipientTypeData, ...specialCategoriesData, {
                  name: "No Special Recognition",
                  value: nonSpecialCount,
                  percentage: nonSpecialPercentage
                }]}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 30,
                  left: 150,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }} 
                  stroke={isDarkMode ? "#aaa" : "#666"}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  width={150}
                  stroke={isDarkMode ? "#aaa" : "#666"}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8884d8">
                  {recipientTypeData.map((entry, index) => (
                    <Cell key={`cell-r-${index}`} fill={COLORS_RECIPIENTS[index % COLORS_RECIPIENTS.length]} />
                  ))}
                  {specialCategoriesData.map((entry, index) => (
                    <Cell key={`cell-s-${index}`} fill={COLORS_SPECIAL[index % COLORS_SPECIAL.length]} />
                  ))}
                  <Cell key="cell-non-special" fill={COLORS_SPECIAL[2]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 