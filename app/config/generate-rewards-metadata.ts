import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateRewardsMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  return {
    title: `Sub: ${subdomain}`,
  };
}
