import { fetchTalentProfile } from "@/app/services/talent";
import { TalentProfileSearchApi } from "@/app/types/talent";

export default async function getUsableProfile(
  level_string: string,
): Promise<TalentProfileSearchApi | null> {
  const talentProfileResponse = await fetchTalentProfile(level_string);

  if (!talentProfileResponse) {
    return null;
  }

  return talentProfileResponse.profile;
}
