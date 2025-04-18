"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from "@/app/context/ThemeContext";
import { CumulativeNotificationData, NotificationTokensApiResponse } from "@/app/types/neynar";

export default function SocialGrowthChart() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cumulativeData, setCumulativeData] = useState<CumulativeNotificationData[]>([]);

  const CHART_COLOR = "var(--chart-1)";

  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          '/api/neynar/notification_tokens',
          {
            next: {
              revalidate: 86400
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json() as NotificationTokensApiResponse;
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch data');
        }
        
        setCumulativeData(result.cumulativeData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotificationData();
  }, []);

  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";

  const renderChart = (data: CumulativeNotificationData[]) => (
    <ResponsiveContainer width="95%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
        <XAxis 
          dataKey="date"
          tick={{ fontSize: 12 }} 
          stroke={isDarkMode ? "#aaa" : "#666"}
          dy={10}
        />
        <YAxis 
          domain={[0, 'auto']} 
          tick={{ fontSize: 12 }} 
          stroke={isDarkMode ? "#aaa" : "#666"}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#333",
            border: `1px solid ${isDarkMode ? "#555" : "#ddd"}`,
            fontSize: 12
          }}
          formatter={(value, name) => {
            if (name === "Warpcast Mini App Added") {
              return [value, "Warpcast Mini App Added"];
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
          type="linear"
          dataKey="cumulativeEnabled" 
          stroke={CHART_COLOR} 
          activeDot={{ r: 6 }} 
          name="Warpcast Mini App Added" 
          strokeWidth={1}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  if (loading) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>
          Warpcast Mini App Users
        </div>
        <div className={`text-xs ${textColor} py-4 flex justify-center`}>
          Loading Data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>
          Warpcast Mini App Users
        </div>
        <div className={`text-xs ${descColor} mt-4 flex justify-center text-red-500`}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (cumulativeData.length === 0) {
    return (
      <div className={cardClass}>
        <div className={`font-semibold ${textColor}`}>
          Warpcast Mini App Users
        </div>
        <div className={`text-xs ${descColor} mt-4 flex justify-center`}>
          No mini app user data available
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div className="mb-4">
        <div className={`font-semibold mb-1 ${textColor}`}>
          Warpcast Mini App Growth
        </div>
        <div className={`text-xs ${descColor}`}>
          Cumulative users who&apos;ve added this Mini App to Warpcast
        </div>
      </div>
      
      <div className="h-[300px]">{renderChart(cumulativeData)}</div>
    </div>
  );
} 