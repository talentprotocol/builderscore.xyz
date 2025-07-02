"use client";

import { FrameContext } from "@/app/types/rewards/farcaster";
import { sdk } from "@farcaster/frame-sdk";
import { createContext, useContext, useEffect, useState } from "react";

const DEV_FRAME_CONTEXT: FrameContext = {
  user: {
    fid: 856355,
    username: "simao",
    displayName: "Simão",
  },
  client: {
    clientFid: 1,
    added: true,
  },
};

interface UserContextType {
  frameContext: FrameContext | undefined;
  isSDKLoaded: boolean;
}

const UserContext = createContext<UserContextType>({
  frameContext: undefined,
  isSDKLoaded: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const loadSDK = async () => {
      if (process.env.NODE_ENV === "development") {
        setFrameContext(DEV_FRAME_CONTEXT);
        sdk.actions.ready();
      } else {
        setFrameContext(await sdk.context);
        sdk.actions.ready();
        await sdk.actions.addFrame();
      }
    };

    if (!isSDKLoaded) {
      loadSDK();
      setIsSDKLoaded(true);
    }
  }, [isSDKLoaded]);

  return (
    <UserContext.Provider
      value={{
        frameContext,
        isSDKLoaded,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
