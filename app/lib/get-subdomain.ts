import { headers } from "next/headers";

export const getSubdomain = async () => {
  const requestHeaders = await headers();
  const headersAsObject: { [key: string]: string } = {};
  requestHeaders.forEach((value, key) => {
    headersAsObject[key] = value;
  });
  const subdomain = headersAsObject["x-current-subdomain"];

  return subdomain;
};
