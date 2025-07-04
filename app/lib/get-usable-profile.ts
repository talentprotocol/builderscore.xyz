import { fetchTalentProfile } from "@/app/api/talent/profile/route";
import { TalentProfileApi, TalentProfileResponse } from "@/app/types/talent";

export default async function getUsableProfile(
  level_string: string,
): Promise<TalentProfileApi | null> {
  const talentProfileResponse: TalentProfileResponse =
    await fetchTalentProfile(level_string);

  if (!talentProfileResponse) {
    return null;
  }

  return talentProfileResponse.profile;
}
