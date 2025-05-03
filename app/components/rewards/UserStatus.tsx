"use client";

import { useUser } from "@/app/context/UserContext";

export default function UserStatus() {
  const { frameContext, talentProfile } = useUser();

  return (
    <div className="mb-2 inline-flex items-center justify-between gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-1">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
        <span className="text-xs text-green-500">Farcaster Ready</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-green-500">
          FID: {frameContext?.user?.fid || "Not Loaded"}
        </span>
        <span className="text-xs text-green-500">
          Talent: {talentProfile?.id || "Not Loaded"}
        </span>
      </div>
    </div>
  );
}
