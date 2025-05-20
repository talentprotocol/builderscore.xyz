import QueryBuilderTester from "@/app/components/admin/QueryBuilderTester";
import { unauthorized } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const adminToken = (await searchParams).adminToken;
  if (adminToken !== process.env.ADMIN_TOKEN) {
    unauthorized();
  }

  return <QueryBuilderTester />;
}
