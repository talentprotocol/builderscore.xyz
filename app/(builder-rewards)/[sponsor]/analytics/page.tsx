import Analytics from "@/app/components/analytics/Analytics";
import { getCSVData } from "@/app/services/analytics";
import { headers } from "next/headers";

export default async function Page() {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  const data = await getCSVData(subdomain);

  return <Analytics data={data} />;
}
