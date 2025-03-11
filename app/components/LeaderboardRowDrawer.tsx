import Image from "next/image";
import Link from "next/link";
import { LeaderboardEntry } from "@/app/types/leaderboards";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerPortal,
} from "@/app/components/ui/drawer";
import { Button } from "@/app/components/ui/button";
import { formatNumber } from "../lib/utils";

export default function LeaderboardRowDrawer({ selectedBuilder, onClose }: {
  selectedBuilder: LeaderboardEntry | null;
  onClose: () => void;
}) {
  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <DrawerContent className="bg-neutral-900">
          {selectedBuilder && selectedBuilder.user && selectedBuilder.user.passport && (
            <>
              <div className="flex flex-col items-center justify-center p-4">
                <Image
                  src={selectedBuilder.user.profile_picture_url || ""}
                  alt={
                    selectedBuilder.user.passport.passport_profile.display_name || "Talent Builder"
                  }
                  width={80}
                  height={80}
                  className="rounded-full object-cover h-[80px] w-[80px] mb-2"
                />
                <p className="text-white text-lg mb-2">
                  <span className="font-mono text-neutral-500 mr-2">
                    #{selectedBuilder.leaderboard_position}
                  </span>
                  <span className="font-semibold">
                    {selectedBuilder.user.passport.passport_profile.display_name || "Talent Builder"}
                  </span>
                </p>

                <div className="bg-neutral-900 rounded-lg border border-neutral-800 w-full">
                  <div className="flex justify-around border-neutral-800 p-4">
                    <div className="flex flex-col items-center justify-between">
                      <p className="text-neutral-500 text-sm">Builder Score</p>
                      <p className="text-2xl font-mono font-semibold">
                        {selectedBuilder.user.passport.score}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-between">
                      <p className="text-neutral-500 text-sm">Rewards Earned</p>
                      <p className="text-2xl font-mono">
                        <span className="font-semibold">
                          {formatNumber(
                            parseFloat(selectedBuilder.reward_amount || "0")
                          )}
                        </span>
                        <span className="text-neutral-500 text-sm ml-2">
                          $TALENT
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Link
                    href={`https://app.talentprotocol.com/profile/${selectedBuilder.user.passport.passport_id}`}
                    target="_blank"
                    className="w-full"
                  >
                    <Button
                      size="lg"
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-300 cursor-pointer w-full"
                    >
                      View Talent Profile
                    </Button>
                  </Link>
                </DrawerClose>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
} 