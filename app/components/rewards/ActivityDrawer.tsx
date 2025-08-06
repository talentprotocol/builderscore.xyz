import FarcasterLogo from "@/app/components/logos/FarcasterLogo";
import DrawerContent from "@/app/components/rewards/DrawerContent";
import ListItem from "@/app/components/rewards/ListItem";
import { Drawer, DrawerPortal, DrawerTitle } from "@/app/components/ui/drawer";
import { Progress } from "@/app/components/ui/progress";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useSponsor } from "@/app/context/SponsorContext";
import { SPONSOR_SCORING } from "@/app/lib/constants";
import { LeaderboardMetric } from "@/app/types/rewards/leaderboards";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Plus } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MdOutlineToken } from "react-icons/md";

import CeloLogo from "../logos/CeloLogo";

export default function ActivityDrawer({
  activity,
  open,
  setOpen,
}: {
  activity: LeaderboardMetric[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { selectedSponsor } = useSponsor();

  const bonusActivity = activity
    ?.filter((metric) => metric.category === "bonus")
    .filter((metric) => metric.metric_name !== "score")
    .sort((a, b) => b.metric_name.localeCompare(a.metric_name));

  const scoringActivity = activity
    ?.filter((metric) => metric.metric_name === "score")
    .filter(
      (metric) => metric.category !== "total" && metric.category !== "bonus",
    )
    .filter((metric) =>
      SPONSOR_SCORING[
        selectedSponsor?.slug as keyof typeof SPONSOR_SCORING
      ]?.includes(metric.category),
    )
    .sort((a, b) => b.metric_name.localeCompare(a.metric_name));

  const bonusDescriptions = {
    base_builder_bonus:
      "Builder participated in Base Devfolio Hackathons or Base Camp, has completed Base Learn, or received /base-builds rewards.",
    verified_onchain_builder_bonus:
      "User is verified by a trusted organisation as a real builder and is added in the Registry of Onchain Builders.",
    first_time_builder_bonus:
      "User is on the Builder Leaderboard for the first time.",
  };

  const scoringDescriptions = {
    github: "Public GitHub Contributions",
    onchain: "Verified Smart Contracts and Transactions",
    farcaster: "Farcaster Mini App Rewards",
  };

  const celoScoringIcon = (
    <CeloLogo
      className="size-5"
      altcolor={selectedSponsor?.slug === "talent-protocol" ? "#000" : "#fff"}
      color={selectedSponsor?.slug === "talent-protocol" ? "#fff" : "#000"}
    />
  );

  const scoringIcons = {
    github: (
      <FaGithub
        className="size-5"
        color={selectedSponsor?.slug === "talent-protocol" ? "#fff" : "#000"}
      />
    ),
    onchain: (
      <MdOutlineToken
        className="size-5"
        color={selectedSponsor?.slug === "talent-protocol" ? "#fff" : "#000"}
      />
    ),
    farcaster: (
      <FarcasterLogo
        className="size-5"
        altcolor={selectedSponsor?.slug === "talent-protocol" ? "#000" : "#fff"}
        color={selectedSponsor?.slug === "talent-protocol" ? "#fff" : "#000"}
      />
    ),
    proof_of_ship: celoScoringIcon,
    celo_network: celoScoringIcon,
    celo_yapper: celoScoringIcon,
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerPortal>
        <VisuallyHidden asChild>
          <DrawerTitle>Activity</DrawerTitle>
        </VisuallyHidden>

        <DrawerContent className="bg-white dark:bg-neutral-900">
          <ScrollArea className="scrollbar-hide max-w-full overflow-y-scroll">
            <div className="p-4">
              <p className="secondary-text-style ml-1 pb-2 text-sm text-neutral-800 dark:text-white">
                Activity Scoring
              </p>
              <div className="card-style flex flex-col">
                {scoringActivity && scoringActivity.length > 0 ? (
                  scoringActivity.map((metric, index) => (
                    <ListItem
                      key={metric.metric_name + "-" + metric.id}
                      left={
                        <div className="flex w-full items-center gap-3">
                          <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            {scoringIcons[
                              metric.category as keyof typeof scoringIcons
                            ] || <Plus className="size-5" />}
                          </div>

                          <div className="flex w-full flex-col">
                            <div className="flex w-full flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">
                                  {scoringDescriptions[
                                    metric.category as keyof typeof scoringDescriptions
                                  ] ||
                                    metric.category
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1),
                                      )
                                      .join(" ")}
                                </p>

                                <p className="secondary-text-style text-xs">
                                  {metric.raw_value.toFixed(0)}% achieved
                                </p>
                              </div>

                              <Progress
                                value={metric.raw_value}
                                className="h-2 w-full"
                              />
                            </div>
                          </div>
                        </div>
                      }
                      className="w-full"
                      first={index === 0}
                      last={index === scoringActivity.length - 1}
                    />
                  ))
                ) : (
                  <p className="secondary-text-style p-4 text-sm">
                    No Activity found for the current period.
                    <br />
                    <br />
                    Builder Rewards tracks open source contributions on GitHub,
                    verified smart contracts and other sources of activity.
                  </p>
                )}
              </div>

              <p className="secondary-text-style ml-1 pt-4 pb-2 text-sm text-neutral-800 dark:text-white">
                Booster Points
              </p>
              <div className="card-style flex flex-col">
                {bonusActivity && bonusActivity.length > 0 ? (
                  bonusActivity.map((metric, index) => (
                    <ListItem
                      key={metric.metric_name + "-" + metric.raw_value}
                      left={
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                            <Plus
                              className="size-5"
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
                                {metric.metric_name
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(" ")}
                              </p>

                              {metric.raw_value !== null && (
                                <p className="secondary-text-style text-xs">
                                  {metric.raw_value} Extra Points
                                </p>
                              )}
                            </div>

                            <p className="secondary-text-style text-sm text-neutral-800 dark:text-white">
                              {
                                bonusDescriptions[
                                  metric.metric_name as keyof typeof bonusDescriptions
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      }
                      className="w-full"
                      first={index === 0}
                      last={index === bonusActivity.length - 1}
                    />
                  ))
                ) : (
                  <p className="secondary-text-style p-4 text-sm">
                    No Booster Points earned.
                    <br />
                    <br />
                    Check the &quot;How to Earn&quot; section for more
                    information.
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
