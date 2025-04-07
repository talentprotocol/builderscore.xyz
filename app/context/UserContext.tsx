"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { TalentProfile } from "@/app/types/talent";
import { fetchUserByFid } from "@/app/services/talent";
import { FrameContext } from "@/app/types/farcaster";
import { sdk } from "@farcaster/frame-sdk";

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
  isLoading: boolean;
  error: Error | null;
  talentProfile: TalentProfile | null;
  frameContext: FrameContext | undefined;
  hasGithubCredential: boolean;
  hasBasenameCredential: boolean;
  basename: string | null;
}

const UserContext = createContext<UserContextType>({
  isLoading: true,
  error: null,
  talentProfile: null,
  frameContext: undefined,
  hasGithubCredential: false,
  hasBasenameCredential: false,
  basename: null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(null);
  const [frameContext, setFrameContext] = useState<FrameContext>();
  const [hasGithubCredential, setHasGithubCredential] = useState(false);
  const [hasBasenameCredential, setHasBasenameCredential] = useState(false);
  const [basename, setBasename] = useState<string | null>(null);
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
      setIsSDKLoaded(true);
      loadSDK();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!frameContext?.user?.fid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetchUserByFid(frameContext.user.fid);
        setTalentProfile(response.profile || null);
        setHasGithubCredential(response.hasGithubCredential || false);
        setHasBasenameCredential(response.hasBasenameCredential || false);
        setBasename(response.basename || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch user data"));
        setTalentProfile(null);
        setHasGithubCredential(false);
        setHasBasenameCredential(false);
        setBasename(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [frameContext?.user?.fid]);

  return (
    <UserContext.Provider value={{ isLoading, error, talentProfile, frameContext, hasGithubCredential, hasBasenameCredential, basename }}>
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