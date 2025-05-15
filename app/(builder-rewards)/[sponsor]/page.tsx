import Home from "@/app/components/rewards/Home";
import { generateRewardsMetadata } from "@/app/config/generate-rewards-metadata";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateRewardsMetadata();
}

export default function Page() {
  return <Home />;
}
