"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";

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
  
  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

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
    <div className={cardClass}>
      <div className="w-full relative">
        <div className="mb-4">
          <div className={`font-semibold mb-1 ${textColor}`}>Rewards Breakdown</div>
          <div className={`text-xs ${descColor}`}>
            Breakdown of rewards recipients by category
            <div className="text-sm mt-2">
              <span>Total Rewarded Users: {totalCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

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
                  animationDuration={300}
                  isAnimationActive={false}
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
                  wrapperStyle={{ 
                    fontSize: 11,
                    paddingTop: 15
                  }}
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
                  animationDuration={300}
                  isAnimationActive={false}
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
                  wrapperStyle={{ 
                    fontSize: 11,
                    paddingTop: 15
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 