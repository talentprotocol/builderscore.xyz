"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { CSVRow } from "@/app/lib/csv-parser";
import { ProfileLookupResponse, fetchProfileById } from "@/app/services/talent";
import Image from "next/image";
import { useEffect, useState } from "react";

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
}

const BuildersTable = ({
  builders,
  isLoading,
  isWeekly,
}: BuildersTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 dark:bg-neutral-700">
            <th className="w-12 px-2 py-2 text-left text-xs font-medium">
              Rank
            </th>
            <th className="w-24 px-2 py-2 text-left text-xs font-medium">
              Builder
            </th>
            <th className="w-1/2 px-2 py-2 text-right text-xs font-medium">
              {isWeekly ? "Weekly Rewards" : "All-Time Rewards"}
            </th>
          </tr>
        </thead>
        <tbody className="text-neutral-900 dark:text-white">
          {isLoading ? (
            <tr>
              <td colSpan={3} className="py-4 text-center text-xs">
                Loading Data...
              </td>
            </tr>
          ) : (
            builders.map((builder, index) => (
              <tr
                key={builder.profileId}
                className="border-t border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-700"
              >
                <td className="w-12 px-2 py-2 text-xs">{index + 1}</td>
                <td className="w-24 px-2 py-2 text-xs">
                  <div className="flex items-center">
                    {builder.profileData?.imageUrl && (
                      <div className="mr-2 h-6 w-6">
                        <Image
                          src={builder.profileData.imageUrl}
                          alt={builder.profileData.name || "Builder"}
                          width={24}
                          height={24}
                          className="aspect-square rounded-full object-cover"
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
                <td className="px-2 py-2 text-right">
                  {isWeekly
                    ? builder.thisWeekRewardsTotal.toFixed(3)
                    : `(${builder.allTimeRewardsCount}x) ${builder.allTimeRewardsTotal.toFixed(3)}`}{" "}
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

export default function TopBuildersLeaderboard({
  data,
}: TopBuildersLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "allTime">("allTime");
  const [buildersData, setBuildersData] = useState<BuilderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);

      const processedData: BuilderData[] = data.map((row) => ({
        profileId: String(row["Profile UUID"]),
        shortProfileId: String(row["Profile UUID"]).substring(0, 8) + "...",
        earnedRewardsThisWeek: Number(row["Earned Rewards this"]),
        thisWeekRewardsTotal: Number(row["This Week's Rewards Total"]),
        allTimeRewardsCount: Number(row["All-time Rewards Count"]),
        allTimeRewardsTotal: Number(row["All-time Rewards Total"]),
      }));

      try {
        const topBuilders = [...processedData].sort(
          (a, b) => b.allTimeRewardsTotal - a.allTimeRewardsTotal,
        );

        const fetchProfiles = async () => {
          const profilePromises = topBuilders.map(async (builder) => {
            const profileData: ProfileLookupResponse = await fetchProfileById(
              builder.profileId,
            );
            if (profileData.profile) {
              return {
                ...builder,
                profileData: {
                  name:
                    profileData.profile.name ||
                    profileData.profile.display_name ||
                    builder.shortProfileId,
                  imageUrl:
                    profileData.profile.image_url || "/default-avatar.png",
                },
              };
            }
            return builder;
          });

          const updatedBuilders = await Promise.all(profilePromises);

          setBuildersData(updatedBuilders);
          setIsLoading(false);
        };

        fetchProfiles();
      } catch {
        setBuildersData(processedData);
        setIsLoading(false);
      }
    };

    processData();
  }, [data]);

  const weeklyBuilders = [...buildersData].sort(
    (a, b) => b.thisWeekRewardsTotal - a.thisWeekRewardsTotal,
  );

  const allTimeBuilders = [...buildersData].sort(
    (a, b) => b.allTimeRewardsTotal - a.allTimeRewardsTotal,
  );

  return (
    <div className="rounded-lg border border-neutral-300 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-800">
      <Tabs
        defaultValue="allTime"
        className="relative w-full"
        onValueChange={(value) => setActiveTab(value as "weekly" | "allTime")}
      >
        <div className="sm:mb-4">
          <div className="mb-1 font-semibold text-neutral-900 dark:text-white">
            Top Builders Leaderboard
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {activeTab === "weekly"
              ? "Ranking of builders by rewards earned in the latest week"
              : "Ranking of builders by total rewards earned all-time"}
          </div>
        </div>

        <TabsList className="top-0 right-0 mb-3 bg-neutral-200 text-neutral-800 sm:absolute dark:bg-neutral-900 dark:text-white">
          <TabsTrigger
            className="mr-0.5 cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
            value="weekly"
          >
            Weekly
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
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
          />
        </TabsContent>

        <TabsContent value="allTime" className="mt-0">
          <BuildersTable
            builders={allTimeBuilders}
            isLoading={isLoading}
            isWeekly={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
