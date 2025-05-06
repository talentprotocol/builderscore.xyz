"use client";

import { fetchUserByFid } from "@/app/services/talent";
import { FrameContext } from "@/app/types/rewards/farcaster";
import { TalentBuilderScore, TalentProfileApi } from "@/app/types/talent";
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
  loadingUser: boolean;

  talentProfile: TalentProfileApi | null;
  frameContext: FrameContext | undefined;

  github: boolean;
  basename: string | null;
  builderScore: TalentBuilderScore | null;
}

const UserContext = createContext<UserContextType>({
  loadingUser: true,

  talentProfile: null,
  frameContext: undefined,

  github: false,
  basename: null,
  builderScore: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [loadingUser, setLoadingUser] = useState(true);
  const [talentProfile, setTalentProfile] = useState<TalentProfileApi | null>(
    null,
  );
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [github, setGithub] = useState(false);
  const [basename, setBasename] = useState<string | null>(null);
  const [builderScore, setBuilderScore] = useState<TalentBuilderScore | null>(
    null,
  );
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
        setTalentProfile(response.profile as TalentProfileApi | null);
        setGithub(response.github || false);
        setBasename(response.basename || null);
        setBuilderScore(response.builderScore || null);
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
