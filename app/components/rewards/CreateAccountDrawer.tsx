"use client";

import MiniAppExternalLink from "@/app/components/MiniAppExternalLink";
import TalentProtocolLogo from "@/app/components/logos/TalentProtocolLogo";
import { Button } from "@/app/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function CreateAccountDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DrawerTitle>Create Talent Profile</DrawerTitle>
        </VisuallyHidden>
        <DrawerContent className="bg-white dark:bg-neutral-900">
          <div className="flex w-full flex-col items-start p-4">
            <TalentProtocolLogo className="size-5 w-auto" color="#070707" />

            <p className="mt-3 text-neutral-600 dark:text-neutral-500">
              Please create a Talent Protocol Profile and connect your Farcaster
              wallet to view your rewards.
            </p>
          </div>

          <DrawerFooter className="pt-0">
            <MiniAppExternalLink
              href={`https://login.talentprotocol.com/join`}
              className="w-full"
            >
              <Button
                size="lg"
                className="mb-3 w-full cursor-pointer border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
              >
                Create Talent Profile
              </Button>
            </MiniAppExternalLink>
          </DrawerFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
