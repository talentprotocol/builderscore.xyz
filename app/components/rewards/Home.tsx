"use client";

import Header from "@/app/components/rewards/Header";
import Actions from "@/app/components/rewards/Actions";
import LeaderboardWrapper from "@/app/components/rewards/LeaderboardWrapper";
import { useLoadRewards } from "@/app/hooks/useLoadRewards";

export default function Home() {
  useLoadRewards();

  return (
    <>
      <Header />
      <Actions />
      {/* <LeaderboardWrapper /> */}
    </>
  );
}
