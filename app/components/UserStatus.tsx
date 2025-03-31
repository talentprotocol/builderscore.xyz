"use client";

import { useUser } from "@/app/context/UserContext";

export default function UserStatus() {
  const { frameContext, talentProfile } = useUser();

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-2 justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
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
