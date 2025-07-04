import { TalentProfileSearchApi } from "@/app/types/talent";
import Image from "next/image";

export default function ProfileView({
  profile,
}: {
  profile: TalentProfileSearchApi;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Image
        src={profile.image_url?.startsWith("http") ? profile.image_url : ""}
        alt={profile.display_name || "Builder"}
        width={80}
        height={80}
        className="mb-3 h-[80px] w-[80px] rounded-full object-cover"
      />
      <p className="mb-3 text-center text-lg font-semibold text-neutral-800 dark:text-white">
        {profile.display_name || "Builder"}
      </p>

      <div className="card-style w-full">
        <div className="flex justify-around p-4">
          <div className="flex flex-col items-center justify-between">
            <p className="secondary-text-style text-xs">Builder Score</p>
            <p className="font-mono text-2xl font-semibold">
              {profile.builder_score?.points || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
