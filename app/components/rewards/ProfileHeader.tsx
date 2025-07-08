import { TalentProfileSearchApi } from "@/app/types/talent";
import Image from "next/image";

export default function ProfileHeader({
  profile,
}: {
  profile: TalentProfileSearchApi;
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex max-w-5/6 flex-col gap-0.5">
          <p className="font-semibold text-neutral-800 dark:text-white">
            {profile.display_name || "Builder"}
          </p>

          <p className="secondary-text-style text-sm">XX Total Followers</p>
        </div>

        <Image
          src={profile.image_url?.startsWith("http") ? profile.image_url : ""}
          alt={profile.display_name || "Builder"}
          width={60}
          height={60}
          className="h-[60px] w-[60px] rounded-full object-cover"
        />
      </div>

      <p className="secondary-text-style text-sm">{profile.bio}</p>
    </div>
  );
}
