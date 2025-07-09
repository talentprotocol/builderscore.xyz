import SocialsListDrawer from "@/app/components/rewards/SocialsListDrawer";
import { Button } from "@/app/components/ui/button";
import { formatNumber } from "@/app/lib/utils";
import {
  TalentAccount,
  TalentProfileSearchApi,
  TalentSocial,
} from "@/app/types/talent";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function ProfileHeader({
  profile,
  socials,
  accounts,
}: {
  profile: TalentProfileSearchApi;
  socials?: TalentSocial[];
  accounts?: TalentAccount[];
}) {
  const [openSocials, setOpenSocials] = useState(false);

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
          <Button
            variant="invisible"
            size="invisible"
            className="cursor-pointer"
            onClick={() => setOpenSocials(true)}
          >
            <p className="text-lg font-semibold text-neutral-800 dark:text-white">
              {profile.display_name || "Builder"}
            </p>
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>

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

      <SocialsListDrawer
        socials={socials || []}
        accounts={accounts || []}
        open={openSocials}
        setOpen={setOpenSocials}
      />
    </div>
  );
}
