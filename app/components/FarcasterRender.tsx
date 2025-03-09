"use client";

import { useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <span className="text-xs text-green-500">Farcaster Ready</span>
    </div>
  );
}
