"use client";

import ProfileWrapper from "@/app/components/rewards/ProfileWrapper";
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
} from "@/app/components/ui/drawer";
import { TalentProfileSearchApi } from "@/app/types/talent";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SearchProfileItemDrawer({
  selectedBuilder,
  onClose,
}: {
  selectedBuilder: TalentProfileSearchApi;
  onClose: () => void;
}) {
  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>{selectedBuilder.name || "Builder"}</DialogTitle>
        </VisuallyHidden>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <ProfileWrapper profile={selectedBuilder} className="p-4" />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
