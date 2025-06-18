import Analytics from "@/app/components/analytics/Analytics";
import { getCSVData } from "@/app/services/rewards/analytics";
import { headers } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ sponsor: string }>;
}) {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  const { sponsor } = await params;

  let sponsorToUse;
  if (subdomain) {
    if (sponsor) {
      sponsorToUse = sponsor;
    } else {
      sponsorToUse = subdomain;
    }
  } else {
    sponsorToUse = sponsor;
  }

  const data = await getCSVData(sponsorToUse);

  return <Analytics data={data} />;
}
