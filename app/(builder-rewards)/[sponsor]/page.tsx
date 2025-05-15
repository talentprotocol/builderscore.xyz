import Home from "@/app/components/rewards/Home";
import { generateRewardsMetadata } from "@/app/config/generate-rewards-metadata";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  return generateRewardsMetadata();
}

export default async function Page() {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  console.log("subdomain from sponsor page", subdomain);

  return <Home />;
}
