import { getCSVData } from "@/app/services/analytics";
import Analytics from "@/app/components/analytics/Analytics";

export default async function AnalyticsPage() {
  const data = await getCSVData();

  return <Analytics data={data} />;
}
