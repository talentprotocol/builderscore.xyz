import RewardsView from "@/app/components/rewards/RewardsView";
import { SPONSORS } from "@/app/lib/constants";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ sponsor: string }>;
}) {
  const { sponsor } = await params;

  if (!SPONSORS[sponsor as keyof typeof SPONSORS] || sponsor === "preview") {
    return notFound();
  }

  return <RewardsView sponsor={sponsor} />;
}
