import ListItem from "@/app/components/rewards/ListItem";
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerTitle,
} from "@/app/components/ui/drawer";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useSponsor } from "@/app/context/SponsorContext";
import { SocialLogos } from "@/app/lib/social-logos";
import { TalentAccount, TalentSocial } from "@/app/types/talent";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Globe, Wallet } from "lucide-react";
import { cloneElement } from "react";

import Spinner from "../Spinner";

export default function SocialsListDrawer({
  socials,
  accounts,
  open,
  setOpen,
}: {
  socials: TalentSocial[];
  accounts: TalentAccount[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { selectedSponsor } = useSponsor();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DrawerTitle>Socials</DrawerTitle>
        </VisuallyHidden>

        <DrawerContent className="bg-white dark:bg-neutral-900">
          <ScrollArea className="scrollbar-hide max-w-full overflow-y-scroll">
            <div className="p-4">
              <p className="secondary-text-style ml-1 pb-2 text-sm text-neutral-800 dark:text-white">
                Socials
              </p>
              <div className="card-style flex flex-col">
                {socials ? (
                  socials.map((social, index) => (
                    <ListItem
                      key={social.social_slug + "-" + social.handle}
                      href={social.profile_url}
                      left={
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            {SocialLogos[
                              social.social_slug as keyof typeof SocialLogos
                            ] ? (
                              cloneElement(
                                SocialLogos[
                                  social.social_slug as keyof typeof SocialLogos
                                ],
                                {
                                  className: "block h-5 w-5",
                                  color:
                                    selectedSponsor?.slug === "talent-protocol"
                                      ? "#fff"
                                      : "#000",
                                  altcolor:
                                    selectedSponsor?.slug === "talent-protocol"
                                      ? "#000"
                                      : "#fff",
                                },
                              )
                            ) : (
                              <Globe
                                className="block h-5 w-5"
                                color={
                                  selectedSponsor?.slug === "talent-protocol"
                                    ? "#fff"
                                    : "#000"
                                }
                              />
                            )}
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">
                                {social.handle}
                              </p>

                              {social.followers_count !== null && (
                                <p className="secondary-text-style text-xs">
                                  {social.followers_count} followers
                                </p>
                              )}
                            </div>

                            <p className="secondary-text-style text-sm text-neutral-800 dark:text-white">
                              {social.social_name}
                            </p>
                          </div>
                        </div>
                      }
                      className="w-full"
                      first={index === 0}
                      last={index === socials.length - 1}
                    />
                  ))
                ) : (
                  <Spinner className="flex h-16 w-full items-center justify-center" />
                )}
              </div>

              <p className="secondary-text-style ml-1 pt-4 pb-2 text-sm text-neutral-800 dark:text-white">
                Wallets
              </p>

              <div className="card-style flex flex-col">
                {accounts && accounts.length > 0 ? (
                  accounts
                    .filter((account) => account.source === "wallet")
                    .map((account, index) => (
                      <ListItem
                        key={account.identifier}
                        href={`https://etherscan.io/address/${account.identifier}`}
                        left={
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                              <Wallet
                                className="block h-5 w-5"
                                color={
                                  selectedSponsor?.slug === "talent-protocol"
                                    ? "#fff"
                                    : "#000"
                                }
                              />
                            </div>

                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {account.identifier.slice(0, 6)}...
                                  {account.identifier.slice(-4)}
                                </p>
                              </div>
                            </div>
                          </div>
                        }
                        className="w-full"
                        first={index === 0}
                        last={index === accounts.length - 1}
                      />
                    ))
                ) : (
                  <Spinner className="flex h-16 w-full items-center justify-center" />
                )}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
