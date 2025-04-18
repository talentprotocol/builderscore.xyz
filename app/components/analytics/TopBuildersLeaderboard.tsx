"use client";

import { CSVRow } from "@/app/lib/csv-parser";
import { useTheme } from "@/app/context/ThemeContext";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { fetchProfileById, ProfileLookupResponse } from "@/app/services/talent";
import Image from "next/image";

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
  profileData?: {
    name: string;
    imageUrl: string;
  };
}

interface BuildersTableProps {
  builders: BuilderData[];
  isLoading: boolean;
  isWeekly: boolean;
  tableHeaderBg: string;
  tableRowBg: string;
  tableBorderColor: string;
  textColor: string;
}

const BuildersTable = ({ 
  builders, 
  isLoading, 
  isWeekly, 
  tableHeaderBg, 
  tableRowBg, 
  tableBorderColor,
  textColor
}: BuildersTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className={tableHeaderBg}>
            <th className="px-4 py-2 text-left font-medium w-16">Rank</th>
            <th className="px-4 py-2 text-left font-medium w-1/2">Builder</th>
            <th className="px-4 py-2 text-right font-medium w-1/2">
              {isWeekly ? "Weekly Rewards" : "All-Time Rewards"}
            </th>
          </tr>
        </thead>
        <tbody className={textColor}>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Loading profiles...
              </td>
            </tr>
          ) : (
            builders.map((builder, index) => (
              <tr
                key={builder.profileId}
                className={`${tableRowBg} border-t ${tableBorderColor}`}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    {builder.profileData?.imageUrl && (
                      <div className="w-6 h-6 mr-2">
                        <Image
                          src={builder.profileData.imageUrl}
                          alt={builder.profileData.name || "Builder"}
                          width={24}
                          height={24}
                          className="rounded-full object-cover aspect-square"
                        />
                      </div>
                    )}
                    <span className="truncate">
                      {builder.profileData?.name || (
                        <span className="font-mono text-xs">
                          {builder.shortProfileId}
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right">
                  {isWeekly
                    ? builder.thisWeekRewardsTotal.toFixed(8)
                    : `(${builder.allTimeRewardsCount} Reward${
                        builder.allTimeRewardsCount === 1 ? "" : "s"
                      }) ${builder.allTimeRewardsTotal.toFixed(8)}`}{" "}
                  ETH
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function TopBuildersLeaderboard({ data }: TopBuildersLeaderboardProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'weekly' | 'allTime'>('allTime');
  const [buildersData, setBuildersData] = useState<BuilderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      
      const processedData: BuilderData[] = data.map(row => ({
        profileId: String(row["Profile UUID"]),
        shortProfileId: String(row["Profile UUID"]).substring(0, 8) + "...",
        earnedRewardsThisWeek: Number(row["Earned Rewards this"]),
        thisWeekRewardsTotal: Number(row["This Week's Rewards Total"]),
        allTimeRewardsCount: Number(row["All-time Rewards Count"]),
        allTimeRewardsTotal: Number(row["All-time Rewards Total"])
      }));
      
      try {
        const topBuilders = [...processedData]
          .sort((a, b) => b.allTimeRewardsTotal - a.allTimeRewardsTotal)
        
        const fetchProfiles = async () => {
          const profilePromises = topBuilders.map(async (builder) => {
            try {
              const profileData: ProfileLookupResponse = await fetchProfileById(builder.profileId);
              if (profileData.profile) {
                return {
                  ...builder,
                  profileData: {
                    name: profileData.profile.name || profileData.profile.display_name || builder.shortProfileId,
                    imageUrl: profileData.profile.image_url || '/default-avatar.png',
                  }
                };
              }
              return builder;
            } catch (error) {
              console.error(`Error fetching profile for ${builder.profileId}:`, error);
              return builder;
            }
          });
          
          const updatedBuilders = await Promise.all(profilePromises);
          setBuildersData(updatedBuilders);
          setIsLoading(false);
        };
        
        fetchProfiles();
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setBuildersData(processedData);
        setIsLoading(false);
      }
    };
    
    processData();
  }, [data]);

  const weeklyBuilders = [...buildersData]
    .sort((a, b) => b.thisWeekRewardsTotal - a.thisWeekRewardsTotal);
    
  const allTimeBuilders = [...buildersData]
    .sort((a, b) => b.allTimeRewardsTotal - a.allTimeRewardsTotal);

  const cardClass = `p-4 rounded-lg ${
    isDarkMode ? "bg-neutral-800 border border-neutral-800" : "bg-white border border-neutral-300"
  }`;
  const textColor = isDarkMode ? "text-white" : "text-neutral-900";
  const descColor = isDarkMode ? "text-neutral-400" : "text-neutral-500";
  const tabBgClass = isDarkMode ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-800";
  const tabItemClass = isDarkMode
    ? "bg-neutral-900 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
    : "bg-neutral-200 hover:bg-white data-[state=active]:bg-white text-neutral-800";
  const tableHeaderBg = isDarkMode ? "bg-neutral-700" : "bg-neutral-100";
  const tableRowBg = isDarkMode ? "hover:bg-neutral-700" : "hover:bg-neutral-50";
  const tableBorderColor = isDarkMode ? "border-neutral-700" : "border-neutral-200";

  return (
    <div className={cardClass}>
      <Tabs defaultValue="allTime" className="w-full relative" onValueChange={(value) => setActiveTab(value as 'weekly' | 'allTime')}>
        <div className="mb-4">
          <div className={`font-semibold mb-1 ${textColor}`}>
            Top Builders Leaderboard
          </div>
          <div className={`text-xs ${descColor}`}>
            {activeTab === 'weekly' 
              ? 'Ranking of builders by rewards earned in the latest week' 
              : 'Ranking of builders by total rewards earned all-time'
            }
          </div>
        </div>

        <TabsList className={`mb-3 absolute top-0 right-0 ${tabBgClass}`}>
          <TabsTrigger
            className={`text-xs cursor-pointer mr-0.5 ${tabItemClass}`}
            value="weekly"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            className={`text-xs cursor-pointer ${tabItemClass}`}
            value="allTime"
          >
            All-Time
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-0">
          <BuildersTable 
            builders={weeklyBuilders}
            isLoading={isLoading}
            isWeekly={true}
            tableHeaderBg={tableHeaderBg}
            tableRowBg={tableRowBg}
            tableBorderColor={tableBorderColor}
            textColor={textColor}
          />
        </TabsContent>

        <TabsContent value="allTime" className="mt-0">
          <BuildersTable 
            builders={allTimeBuilders}
            isLoading={isLoading}
            isWeekly={false}
            tableHeaderBg={tableHeaderBg}
            tableRowBg={tableRowBg}
            tableBorderColor={tableBorderColor}
            textColor={textColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 