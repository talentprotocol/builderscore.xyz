"use client";

import HowToDrawer from "@/app/components/HowToDrawer";
import { Button } from "@/app/components/ui/button";
import { useUser } from "@/app/context/UserContext";
import ExternalLink from "./ExternalLink";

export default function RewardsActions() {
  const { talentProfile, hasGithubCredential } = useUser();

  return (
    <div className="grid auto-cols-fr grid-flow-col gap-4 mt-3 w-full">
      {!hasGithubCredential && (
        <ExternalLink
          href={
            talentProfile
              ? "https://app.talentprotocol.com/settings/connected_accounts"
              : "https://app.talentprotocol.com"
          }
          target="_blank"
          className="w-full"
        >
          <Button
            size="lg"
            className="bg-white hover:bg-neutral-100 border border-neutral-200 cursor-pointer w-full text-black"
          >
            {talentProfile ? "Connect GitHub" : "Sign Up for Talent"}
          </Button>
        </ExternalLink>
      )}

      <HowToDrawer />
    </div>
  );
}
