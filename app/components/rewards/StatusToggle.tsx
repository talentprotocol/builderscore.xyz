"use client";

import RewardsStatus from "@/app/components/rewards/RewardsStatus";
import UserStatus from "@/app/components/rewards/UserStatus";
import { Button } from "@/app/components/ui/button";
import { Activity } from "lucide-react";
import { useState } from "react";

export default function StatusToggle() {
  const [showStatus, setShowStatus] = useState(false);
  return (
    <div className="absolute top-3 left-3 flex flex-col">
      <Button
        variant="outline"
        className="mb-3 h-8 w-8 rounded-full border-green-500/20 bg-green-100 hover:bg-green-200"
        onClick={() => setShowStatus(!showStatus)}
      >
        <Activity className="h-3 w-3 text-green-500" />
      </Button>

      {showStatus && (
        <>
          <UserStatus />
          <RewardsStatus />
        </>
      )}
    </div>
  );
}
