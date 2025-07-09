import { formatNumber } from "@/app/lib/utils";
import { TalentProfileSearchApi, TalentSocial } from "@/app/types/talent";
import Image from "next/image";

export default function ProfileHeader({
  profile,
  socials,
}: {
  profile: TalentProfileSearchApi;
  socials?: TalentSocial[];
}) {
  const totalFollowers = socials?.reduce((acc, social) => {
    if (social.followers_count) {
      return acc + social.followers_count;
    }
    return acc;
  }, 0);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex max-w-5/6 flex-col gap-0">
          <p className="text-lg font-semibold text-neutral-800 dark:text-white">
            {profile.display_name || "Builder"}
          </p>

          <p className="secondary-text-style text-sm">
            {formatNumber(totalFollowers || 0)} followers
          </p>
        </div>

        <Image
          src={profile.image_url?.startsWith("http") ? profile.image_url : ""}
          alt={profile.display_name || "Builder"}
          width={60}
          height={60}
          className="border-primary h-[60px] w-[60px] rounded-full border object-cover"
        />
      </div>

      <p className="secondary-text-style text-sm">{profile.bio}</p>
    </div>
  );
}
