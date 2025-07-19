import {
  ALLOWED_SPONSORS,
  DEFAULT_SPONSOR_SLUG,
  SUBDOMAIN_TO_SPONSOR,
} from "@/app/lib/constants";
import { getSubdomain } from "@/app/lib/get-subdomain";

export default async function getUsableSponsor(level_string: string) {
  if (ALLOWED_SPONSORS.includes(level_string)) {
    return level_string;
  }

  const subdomain = await getSubdomain();

  if (subdomain) {
    return SUBDOMAIN_TO_SPONSOR[subdomain as keyof typeof SUBDOMAIN_TO_SPONSOR];
  }

  return DEFAULT_SPONSOR_SLUG;
}
