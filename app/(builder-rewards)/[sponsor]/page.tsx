import Home from "@/app/components/rewards/Home";
import { generateRewardsMetadata } from "@/app/config/generate-rewards-metadata";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  return generateRewardsMetadata();
}

export default async function Page({
  params,
}: {
  params: { sponsor: string };
}) {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];
  const sponsorParam = params.sponsor;

  console.log("sponsor param:", sponsorParam);
  console.log("subdomain from sponsor page:", subdomain);
  console.log("all requestHeaders:", headersAsObject);

  return <Home />;
}
