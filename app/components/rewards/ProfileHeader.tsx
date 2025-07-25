import SocialsListDrawer from "@/app/components/rewards/SocialsListDrawer";
import { Button } from "@/app/components/ui/button";
import { useNavigationSource } from "@/app/context/NavigationContext";
import { cn, formatNumber } from "@/app/lib/utils";
import {
  TalentAccount,
  TalentBasicProfile,
  TalentSocial,
} from "@/app/types/talent";
import { ChevronLeftIcon, EllipsisIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* eslint-disable @next/next/no-img-element */

export default function ProfileHeader({
  profile,
  socials,
  accounts,
  detailed,
}: {
  profile: TalentBasicProfile;
  socials?: TalentSocial[];
  accounts?: TalentAccount[];
  detailed?: boolean;
}) {
  const [openSocials, setOpenSocials] = useState(false);
  const router = useRouter();
  const { isInternalNavigation } = useNavigationSource();

  const totalFollowers = socials?.reduce((acc, social) => {
    if (social.followers_count) {
      return acc + social.followers_count;
    }
    return acc;
  }, 0);

  const showBackButton = detailed && isInternalNavigation;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-full">
          {showBackButton && (
            <Button
              variant="invisible"
              size="invisible"
              onClick={() => router.back()}
              className="mt-1.5 h-fit w-8 cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 opacity-50" />
            </Button>
          )}

          <div className="flex max-w-5/6 flex-col gap-0">
            <Button
              variant="invisible"
              size="invisible"
              className={cn(detailed && "cursor-pointer", "w-fit")}
              onClick={() => detailed && setOpenSocials(true)}
            >
              <p className="text-lg font-medium text-neutral-800 dark:text-white">
                {profile.display_name || "Builder"}
              </p>
              {detailed && <EllipsisIcon className="size-4 opacity-50" />}
            </Button>

            <p className="secondary-text-style text-sm">
              {formatNumber(totalFollowers || 0)} followers
            </p>
          </div>
        </div>

        <img
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
