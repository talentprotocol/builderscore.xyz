import { ALLOWED_SPONSORS, DEFAULT_SPONSOR_SLUG } from "@/app/lib/constants";

export default function getUsableSponsor(level_string: string) {
  if (ALLOWED_SPONSORS.includes(level_string)) {
    return level_string;
  }

  return DEFAULT_SPONSOR_SLUG;
}
