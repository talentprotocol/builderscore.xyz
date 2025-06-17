"use client";

import ActivityByTypeChart from "@/app/components/analytics/ActivityByTypeChart";
import ActivityChart from "@/app/components/analytics/ActivityChart";
import DataTable from "@/app/components/analytics/DataTable";
import MetricsCards from "@/app/components/analytics/MetricsCards";
import ReportDrawer from "@/app/components/analytics/ReportDrawer";
import RetentionRateChart from "@/app/components/analytics/RetentionRateChart";
import RewardsBreakdownChart from "@/app/components/analytics/RewardsBreakdownChart";
import SocialGrowthChart from "@/app/components/analytics/SocialGrowthChart";
import TopBuildersLeaderboard from "@/app/components/analytics/TopBuildersLeaderboard";
import WinnersProfileChart from "@/app/components/analytics/WinnersProfileChart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { CSVDataResult } from "@/app/services/rewards/analytics";

interface AnalyticsProps {
  data: CSVDataResult;
}

export default function Analytics({ data }: AnalyticsProps) {
  return (
    <div className="container mx-auto py-3">
      <Tabs defaultValue="charts" className="relative w-full">
        <div className="mb-3 flex items-center justify-between">
          <TabsList className="bg-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:text-white">
            <TabsTrigger
              className="mr-0.5 cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
              value="charts"
            >
              Charts
            </TabsTrigger>
            <TabsTrigger
              className="cursor-pointer bg-neutral-200 text-xs text-neutral-800 hover:bg-white data-[state=active]:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:data-[state=active]:bg-neutral-800"
              value="data"
            >
              Raw Data
            </TabsTrigger>
          </TabsList>

          <ReportDrawer report={data.summaryText} />
        </div>

        <TabsContent value="charts" className="flex flex-col gap-3">
          <MetricsCards metrics={data.metricsTotals} />
          <ActivityChart
            dailyData={data.dailyActivity}
            weeklyData={data.weeklyActivity}
          />
          <ActivityByTypeChart data={data.activityByType} />
          <RetentionRateChart data={data.retention} />
          <RewardsBreakdownChart data={data.rewardsBreakdown} />
          <WinnersProfileChart data={data.winnersProfile} />
          <SocialGrowthChart />
          <TopBuildersLeaderboard data={data.topBuilders} />
        </TabsContent>

        <TabsContent value="data" className="grid grid-cols-1 gap-3">
          <DataTable
            data={data.dailyActivity}
            title="Daily Builder Activity Data"
            description="Daily new eligible developers, active developers, and activation rate"
          />
          <DataTable
            data={data.weeklyActivity}
            title="Weekly Builder Activity Data"
            description="Weekly new eligible developers, active developers, and activation rate"
          />
          <DataTable
            data={data.activityByType}
            title="Builder Activity By Type Data"
            description="Weekly GitHub and Base Contract activity metrics"
          />
          <DataTable
            data={data.retention}
            title="Builder Rewards Retention Data"
            description="Weekly active developers, inactive developers, and retention rate"
          />
          <DataTable
            data={data.rewardsBreakdown}
            title="Rewards Breakdown Data"
            description="Breakdown of rewards recipients by category"
          />
          <DataTable
            data={data.winnersProfile}
            title="Winners Profile Data"
            description="Distribution of winners by Builder Score level and years of experience"
          />
          <DataTable
            data={data.topBuilders}
            title="Top Builders Data"
            description="Top builders by rewards earned weekly and all-time"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
