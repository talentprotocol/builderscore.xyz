"use client";

import { FrameContext } from "@/app/types/rewards/farcaster";
import { sdk } from "@farcaster/frame-sdk";
import { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  frameContext: FrameContext | undefined;
  isSDKLoaded: boolean;
  simulatedFid: number | undefined;
  setSimulatedFid: (fid: number | undefined) => void;
}

const UserContext = createContext<UserContextType>({
  frameContext: undefined,
  isSDKLoaded: false,
  simulatedFid: undefined,
  setSimulatedFid: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [simulatedFid, setSimulatedFid] = useState<number | undefined>();

  useEffect(() => {
    const loadSDK = async () => {
      let context: FrameContext;

      if (process.env.NODE_ENV === "development") {
        context = {
          user: {
            fid: simulatedFid ?? 856355,
          },
          client: {
            clientFid: 1,
            added: true,
          },
        };
        sdk.actions.ready();
      } else {
        context = await sdk.context;
        sdk.actions.ready();
        await sdk.actions.addFrame();
      }

      if (simulatedFid) {
        context = {
          ...context,
          user: {
            ...context.user,
            fid: simulatedFid,
          },
        };
      }

      setFrameContext(context);
    };

    if (!isSDKLoaded) {
      loadSDK();
      setIsSDKLoaded(true);
    } else if (simulatedFid !== undefined) {
      loadSDK();
    }
  }, [isSDKLoaded, simulatedFid]);

  return (
    <UserContext.Provider
      value={{
        frameContext,
        isSDKLoaded,
        simulatedFid,
        setSimulatedFid,
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
