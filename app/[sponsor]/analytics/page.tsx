import AnalyticsTabs from "@/app/components/analytics/AnalyticsTabs";
import { getCSVData } from "@/app/services/analytics";

export default async function AnalyticsPage() {
  const data = await getCSVData();
  
  return (
    <div className="container mx-auto py-3">
      <AnalyticsTabs data={data} />
    </div>
  );
}