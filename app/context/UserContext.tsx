"use client";

import { fetchUserByFid } from "@/app/services/talent";
import { FrameContext } from "@/app/types/farcaster";
import { APITalentProfile, TalentBuilderScore } from "@/app/types/talent";
import { sdk } from "@farcaster/frame-sdk";
import { useSearchParams } from "next/navigation";
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
  loadingUser: boolean;

  talentProfile: APITalentProfile | null;
  frameContext: FrameContext | undefined;

  github: boolean;
  basename: string | null;
  builderScore: TalentBuilderScore | null;
  selfXyz: boolean;
  celoTransaction: boolean;
}

const UserContext = createContext<UserContextType>({
  loadingUser: true,

  talentProfile: null,
  frameContext: undefined,

  github: false,
  basename: null,
  builderScore: null,
  selfXyz: false,
  celoTransaction: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const testFid = searchParams.get("testFid");

  const [loadingUser, setLoadingUser] = useState(true);
  const [talentProfile, setTalentProfile] = useState<APITalentProfile | null>(
    null,
  );
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [github, setGithub] = useState(false);
  const [basename, setBasename] = useState<string | null>(null);
  const [builderScore, setBuilderScore] = useState<TalentBuilderScore | null>(
    null,
  );
  const [selfXyz, setSelfXyz] = useState(false);
  const [celoTransaction, setCeloTransaction] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const loadSDK = async () => {
      if (process.env.NODE_ENV === "development") {
        const contextToUse = testFid
          ? {
              ...DEV_FRAME_CONTEXT,
              user: {
                ...DEV_FRAME_CONTEXT.user,
                fid: parseInt(testFid, 10),
              },
            }
          : DEV_FRAME_CONTEXT;

        setFrameContext(contextToUse);
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
  }, [isSDKLoaded, testFid]);

  useEffect(() => {
    if (!isSDKLoaded) {
      return;
    }

    if (!frameContext) {
      setLoadingUser(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetchUserByFid(frameContext.user.fid);
        setTalentProfile(response.profile as APITalentProfile | null);
        setGithub(response.github || false);
        setBasename(response.basename || null);
        setBuilderScore(response.builderScore || null);
        setSelfXyz(response.selfXyz || false);
        setCeloTransaction(response.celoTransaction || false);
      } catch {
        setTalentProfile(null);
        setGithub(false);
        setBasename(null);
        setBuilderScore(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [frameContext, isSDKLoaded]);

  return (
    <UserContext.Provider
      value={{
        loadingUser,
        talentProfile,
        frameContext,
        github,
        basename,
        builderScore,
        selfXyz,
        celoTransaction,
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
