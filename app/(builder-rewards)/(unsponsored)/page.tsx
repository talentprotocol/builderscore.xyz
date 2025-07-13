import RewardsView from "@/app/components/rewards/RewardsView";
import {
  DEFAULT_SPONSOR_SLUG,
  SUBDOMAIN_TO_SPONSOR,
} from "@/app/lib/constants";
import { getSubdomain } from "@/app/lib/get-subdomain";

export default async function Page() {
  const sponsor = (await getSubdomain()) || DEFAULT_SPONSOR_SLUG;
  const sponsorSlug =
    SUBDOMAIN_TO_SPONSOR[sponsor as keyof typeof SUBDOMAIN_TO_SPONSOR];

  return <RewardsView sponsor={sponsorSlug} />;
}
