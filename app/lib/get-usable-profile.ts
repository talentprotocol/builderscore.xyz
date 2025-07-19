import {
  fetchTalentProfile,
  fetchTalentProfileByFarcasterUsername,
} from "@/app/services/talent";
import { validate } from "uuid";

export default async function getUsableProfile(level_string: string) {
  if (validate(level_string)) {
    return await fetchTalentProfile(level_string);
  }

  return await fetchTalentProfileByFarcasterUsername(level_string);
}
