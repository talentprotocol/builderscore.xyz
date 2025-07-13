import { CSVRow } from "@/app/lib/csv-parser";
import { BuilderData } from "@/app/services/rewards/analytics";
import { fetchProfileById } from "@/app/services/talent";

export async function fetchTopBuildersLeaderboard(
  data: CSVRow[],
): Promise<BuilderData[]> {
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

    const profilePromises = topBuilders.map(async (builder) => {
      const profileData = await fetchProfileById(builder.profileId);
      if (profileData.profile) {
        return {
          ...builder,
          profileData: {
            name:
              profileData.profile.display_name ||
              profileData.profile.name ||
              builder.shortProfileId,
            imageUrl: profileData.profile.image_url || "/default-avatar.png",
          },
        };
      }
      return builder;
    });

    const updatedBuilders = await Promise.all(profilePromises);
    return updatedBuilders;
  } catch {
    return processedData;
  }
}
