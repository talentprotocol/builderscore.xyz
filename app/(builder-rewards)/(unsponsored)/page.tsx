import RewardsView from "@/app/components/rewards/RewardsView";
import { DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";
import { getSubdomain } from "@/app/lib/get-subdomain";

export default async function Page() {
  const sponsor = (await getSubdomain()) || DEFAULT_SPONSOR_SLUG;

  return <RewardsView sponsor={sponsor} />;
}
