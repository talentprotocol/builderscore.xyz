"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useTheme } from "@/app/context/ThemeContext";
import { useState } from "react";

interface TopBuildersLeaderboardProps {
  data: CSVRow[];
}

interface BuilderData {
  profileId: string;
  shortProfileId: string;
  earnedRewardsThisWeek: number;
  thisWeekRewardsTotal: number;
  allTimeRewardsCount: number;
  allTimeRewardsTotal: number;
}

export default function TopBuildersLeaderboard({ data }: TopBuildersLeaderboardProps) {
  const { isDarkMode } = useTheme();
  const [activeView, setActiveView] = useState<'weekly' | 'allTime'>('allTime');
  const [showAmount, setShowAmount] = useState<5 | 10 | 25>(10);

  // Process and sort the data
  const buildersData: BuilderData[] = data.map(row => ({
    profileId: String(row["Profile UUID"]),
    shortProfileId: String(row["Profile UUID"]).substring(0, 8) + "...",
    earnedRewardsThisWeek: Number(row["Earned Rewards this"]),
    thisWeekRewardsTotal: Number(row["This Week's Rewards Total"]),
    allTimeRewardsCount: Number(row["All-time Rewards Count"]),
    allTimeRewardsTotal: Number(row["All-time Rewards Total"])
  }));

  // Sort based on active view
  const sortedBuilders = [...buildersData].sort((a, b) => {
    if (activeView === 'weekly') {
      return b.thisWeekRewardsTotal - a.thisWeekRewardsTotal;
    } else {
      return b.allTimeRewardsTotal - a.allTimeRewardsTotal;
    }
  });

  // Limit to showAmount
  const displayedBuilders = sortedBuilders.slice(0, showAmount);
  
  const cardBg = isDarkMode ? "bg-neutral-800" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-neutral-800";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";
  const buttonBg = isDarkMode ? "bg-neutral-700 hover:bg-neutral-600" : "bg-neutral-200 hover:bg-neutral-300";
  const activeBg = isDarkMode ? "bg-neutral-600" : "bg-neutral-300";
  const tableHeaderBg = isDarkMode ? "bg-neutral-700" : "bg-neutral-100";
  const tableRowBg = isDarkMode ? "hover:bg-neutral-700" : "hover:bg-neutral-50";
  const tableBorderColor = isDarkMode ? "border-neutral-800" : "border-neutral-300";

  return (
    <Card className={`${cardBg} border-0`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={textColor}>Top Builders Leaderboard</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-md overflow-hidden text-xs">
              <button 
                onClick={() => setActiveView('weekly')} 
                className={`px-2 py-1 ${activeView === 'weekly' ? activeBg : buttonBg} ${textColor}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setActiveView('allTime')} 
                className={`px-2 py-1 ${activeView === 'allTime' ? activeBg : buttonBg} ${textColor}`}
              >
                All-Time
              </button>
            </div>
            <div className="flex rounded-md overflow-hidden text-xs">
              <button 
                onClick={() => setShowAmount(5)} 
                className={`px-2 py-1 ${showAmount === 5 ? activeBg : buttonBg} ${textColor}`}
              >
                Top 5
              </button>
              <button 
                onClick={() => setShowAmount(10)} 
                className={`px-2 py-1 ${showAmount === 10 ? activeBg : buttonBg} ${textColor}`}
              >
                Top 10
              </button>
              <button 
                onClick={() => setShowAmount(25)} 
                className={`px-2 py-1 ${showAmount === 25 ? activeBg : buttonBg} ${textColor}`}
              >
                Top 25
              </button>
            </div>
          </div>
        </div>
        <CardDescription className={descColor}>
          {activeView === 'weekly' 
            ? 'Ranking of builders by rewards earned in the latest week' 
            : 'Ranking of builders by total rewards earned all-time'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`${tableHeaderBg}`}>
                <th className="px-4 py-2 text-left font-medium">Rank</th>
                <th className="px-4 py-2 text-left font-medium">Builder ID</th>
                {activeView === 'weekly' ? (
                  <>
                    <th className="px-4 py-2 text-right font-medium">Weekly Rewards</th>
                    <th className="px-4 py-2 text-right font-medium">Weekly Count</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2 text-right font-medium">All-Time Rewards</th>
                    <th className="px-4 py-2 text-right font-medium">All-Time Count</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className={`${textColor}`}>
              {displayedBuilders.map((builder, index) => (
                <tr key={builder.profileId} className={`${tableRowBg} border-t ${tableBorderColor}`}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-mono text-xs">{builder.shortProfileId}</td>
                  {activeView === 'weekly' ? (
                    <>
                      <td className="px-4 py-2 text-right">{builder.thisWeekRewardsTotal.toFixed(8)}</td>
                      <td className="px-4 py-2 text-right">{builder.earnedRewardsThisWeek}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-right">{builder.allTimeRewardsTotal.toFixed(8)}</td>
                      <td className="px-4 py-2 text-right">{builder.allTimeRewardsCount}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 