import Analytics from "@/app/components/analytics/Analytics";
import { getCSVData } from "@/app/services/rewards/analytics";

export default async function Page() {
  const data = await getCSVData();

  return <Analytics data={data} />;
}
