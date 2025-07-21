"use client";

import DrawerContent from "@/app/components/rewards/DrawerContent";
import ProfileWrapper from "@/app/components/rewards/ProfileWrapper";
import { Drawer, DrawerPortal } from "@/app/components/ui/drawer";
import { TalentBasicProfile, TalentSearchProfile } from "@/app/types/talent";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SearchProfileItemDrawer({
  selectedBuilder,
  onClose,
}: {
  selectedBuilder: TalentSearchProfile;
  onClose: () => void;
}) {
  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>{selectedBuilder.name || "Builder"}</DialogTitle>
        </VisuallyHidden>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <ProfileWrapper
            profile={selectedBuilder as TalentBasicProfile}
            builderScore={selectedBuilder.builder_score}
            className="p-4"
          />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
