import {
  fetchTalentBuilderScore,
  fetchTalentProfile,
} from "@/app/services/talent";
import { TalentProfileSearchApi } from "@/app/types/talent";

export default async function getUsableProfile(
  level_string: string,
): Promise<TalentProfileSearchApi | null> {
  const talentProfileResponse = await fetchTalentProfile(level_string);
  const talentScoreResponse = await fetchTalentBuilderScore(level_string);

  if (!talentProfileResponse) {
    return null;
  }

  return {
    ...talentProfileResponse.profile,
    builder_score: talentScoreResponse.score,
  };
}
