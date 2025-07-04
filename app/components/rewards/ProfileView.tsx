import { TalentProfileSearchApi } from "@/app/types/talent";

export default function ProfileView({
  profile,
}: {
  profile: TalentProfileSearchApi;
}) {
  return <p>{profile.display_name}</p>;
}
