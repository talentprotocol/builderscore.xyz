"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import ActivationChart from "@/app/components/analytics/ActivationChart";
import GrowthChart from "@/app/components/analytics/GrowthChart";
import RetentionChart from "@/app/components/analytics/RetentionChart";
import DeveloperActivityChart from "@/app/components/analytics/DeveloperActivityChart";
import DataTable from "@/app/components/analytics/DataTable";
import { CSVDataResult } from "@/app/services/analytics";
import { useTheme } from "@/app/context/ThemeContext";

interface AnalyticsTabsProps {
  data: CSVDataResult;
}

export default function AnalyticsTabs({ data }: AnalyticsTabsProps) {
  const { isDarkMode } = useTheme();

  return (
    <Tabs defaultValue="charts" className="w-full">
      <TabsList className={`
        mb-2
        ${
          isDarkMode
            ? "bg-neutral-900 text-white"
            : "bg-neutral-200 text-neutral-800"
        }
      `}>
        <TabsTrigger className={`
          text-xs cursor-pointer
          ${
            isDarkMode
              ? "bg-neutral-900 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
              : "bg-neutral-200 hover:bg-white data-[state=active]:bg-white text-neutral-800"
          }
        `} value="charts">Charts</TabsTrigger>
        <TabsTrigger className={`
          text-xs cursor-pointer
          ${
            isDarkMode
              ? "bg-neutral-900 hover:bg-neutral-800 data-[state=active]:bg-neutral-800"
              : "bg-neutral-200 hover:bg-white data-[state=active]:bg-white text-neutral-800"
          }
        `} value="data">Raw Data</TabsTrigger>
      </TabsList>
      
      <TabsContent value="charts" className="grid grid-cols-1 gap-3">
        <ActivationChart data={data.activation} />
        <GrowthChart data={data.growth} />
        <RetentionChart data={data.retention} />
        <DeveloperActivityChart data={data.developerActivity} />
      </TabsContent>
      
      <TabsContent value="data" className="grid grid-cols-1 gap-3">
        <DataTable 
          data={data.activation} 
          title="Developer Activation Rate Data" 
          description="Percentage of eligible developers with building activity on Base"
        />
        <DataTable 
          data={data.growth} 
          title="Growth in Eligible Developers" 
          description="Net increase in developers meeting all eligibility criteria"
        />
        <DataTable 
          data={data.retention} 
          title="Developer Retention Data" 
          description="Percentage of developers from previous week who remain active"
        />
        <DataTable 
          data={data.developerActivity} 
          title="Developer Activity Types" 
          description="Number of developers with verified GitHub or Base contract activity"
        />
      </TabsContent>
    </Tabs>
  );
} 