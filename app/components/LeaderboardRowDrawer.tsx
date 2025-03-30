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
import { formatNumber, TOKEN_DECIMALS } from "../lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useTheme } from "@/app/context/ThemeContext";

export default function LeaderboardRowDrawer({ selectedBuilder, onClose }: {
  selectedBuilder: LeaderboardEntry | null;
  onClose: () => void;
}) {
  const { isDarkMode } = useTheme();
  const PLACEHOLDER_TOKEN = "$TALENT";

  return (
    <Drawer open={!!selectedBuilder} onOpenChange={onClose}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DialogTitle>
            {selectedBuilder?.profile.name ||
              "Builder"}
          </DialogTitle>
        </VisuallyHidden>
        <DrawerContent className={isDarkMode ? "bg-neutral-900" : "bg-white"}>
          {selectedBuilder &&
            selectedBuilder.profile && (
              <>
                <div className="flex flex-col items-center justify-center p-4">
                  <Image
                    src={selectedBuilder.profile.image_url?.startsWith('http') ? selectedBuilder.profile.image_url : ""}
                    alt={
                      selectedBuilder.profile.name || "Builder"
                    }
                    width={80}
                    height={80}
                    className="rounded-full object-cover h-[80px] w-[80px] mb-3"
                  />
                  <p className={`${isDarkMode ? "text-white" : "text-neutral-800"} text-lg mb-3`}>
                    <span
                      className={`mr-4 ${
                        selectedBuilder.ranking_change === null
                          ? isDarkMode ? "text-neutral-500" : "text-neutral-600" 
                          : selectedBuilder.ranking_change < 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {selectedBuilder.ranking_change !== null
                        ? selectedBuilder.ranking_change < 0
                          ? `↓ ${selectedBuilder.ranking_change}`
                          : `↑ ${selectedBuilder.ranking_change}`
                        : "-"}
                    </span>

                    <span className={`font-mono ${isDarkMode ? "text-neutral-500" : "text-neutral-600"} mr-2`}>
                      #{selectedBuilder.leaderboard_position}
                    </span>
                    <span className="font-semibold">
                      {selectedBuilder.profile.name || "Builder"}
                    </span>
                  </p>

                  <div className={`rounded-lg border w-full ${
                    isDarkMode 
                      ? "bg-neutral-900 border-neutral-800" 
                      : "bg-white border-neutral-200"
                  }`}>
                    <div className="flex justify-around p-4">
                      <div className="flex flex-col items-center justify-between">
                        <p className={`${isDarkMode ? "text-neutral-500" : "text-neutral-600"} text-sm`}>
                          Builder Score
                        </p>
                        <p className="text-2xl font-mono font-semibold">
                          {selectedBuilder.profile.builder_score?.points || "-"}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-between">
                        <p className={`${isDarkMode ? "text-neutral-500" : "text-neutral-600"} text-sm`}>
                          Rewards Earned
                        </p>
                        <p className="text-2xl font-mono">
                          <span className="font-semibold">
                            {formatNumber(
                              parseFloat(selectedBuilder.reward_amount || "0"),
                              TOKEN_DECIMALS[PLACEHOLDER_TOKEN]
                            )}
                          </span>
                          <span className={`${isDarkMode ? "text-neutral-500" : "text-neutral-600"} text-sm ml-2`}>
                            {PLACEHOLDER_TOKEN}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedBuilder.summary && (
                    <div className={`rounded-lg border w-full p-4 mt-3 ${
                      isDarkMode 
                        ? "bg-neutral-900 border-neutral-800" 
                        : "bg-white border-neutral-200"
                    }`}>
                      <div className="flex flex-col">
                        <p className={`${isDarkMode ? "text-neutral-500" : "text-neutral-600"} text-sm mb-1`}>Summary</p>
                        <p className={isDarkMode ? "" : "text-neutral-800"}>
                          {selectedBuilder.summary}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <DrawerFooter className="pt-0">
                  <DrawerClose asChild>
                    <Link
                      href={`https://app.talentprotocol.com/profile/${selectedBuilder.profile.id}`}
                      target="_blank"
                      className="w-full"
                    >
                      <Button
                        size="lg"
                        className={`w-full cursor-pointer border ${
                          isDarkMode 
                            ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" 
                            : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
                        }`}
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