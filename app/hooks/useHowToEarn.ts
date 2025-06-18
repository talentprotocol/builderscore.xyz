import { useUserProfiles } from "@/app/hooks/useRewards";
import { AVAILABLE_SPONSORS, Sponsor } from "@/app/types/rewards/sponsors";

export type SponsorSlug = (typeof AVAILABLE_SPONSORS)[number];

type HowToEarnConfig = {
  description: string;
  steps: {
    text: string;
    url: string;
    condition: boolean | string | null | number | undefined;
  }[];
};

export function useHowToEarn(sponsor: Sponsor): HowToEarnConfig {
  const { data: userProfileData, isLoading: loadingUser } = useUserProfiles();

  const basename = userProfileData?.basename;
  const humanCheckmark = userProfileData?.profile.human_checkmark;
  const builderScore = userProfileData?.builderScore;
  const selfXyzAccount = userProfileData?.selfXyz;
  const celoTransaction = userProfileData?.celoTransaction;

  const baseConfig = {
    description:
      "Talent Protocol distributes weekly rewards to builders that own verified contracts on Base and contribute to public crypto repositories on GitHub. Follow the steps below to be eligible:",
    steps: [
      {
        text: `Own a Basename ${basename ? `(${basename})` : ""}`,
        url: "https://www.base.org/names",
        condition: !loadingUser && basename,
      },
      {
        text: "Get your Human Checkmark",
        url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
        condition: !loadingUser && humanCheckmark,
      },
      {
        text: "Increase your Builder Score to 40+",
        url: "https://app.talentprotocol.com/profile",
        condition: !loadingUser && builderScore && builderScore.points >= 40,
      },
    ],
  };

  const celoConfig = {
    description:
      "Monthly rewards automatically distributed to the top 100 builders who contribute to the Celo ecosystem through verified smart contracts and public contributions on GitHub.",
    steps: [
      {
        text: "Get your Human Checkmark",
        url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
        condition: !loadingUser && humanCheckmark,
      },
      {
        text: "Have 1+ outgoing transactions on Celo",
        url: "https://app.talentprotocol.com",
        condition: !loadingUser && celoTransaction,
      },
      {
        text: "Earn more by verifying your humanity with Self.xyz (optional)",
        url: "https://app.talentprotocol.com/accounts",
        condition: !loadingUser && selfXyzAccount,
      },
    ],
  };

  let config: HowToEarnConfig;

  switch (sponsor.slug) {
    case "base":
      config = baseConfig;
      break;
    case "celo":
      config = celoConfig;
      break;
    default:
      config = baseConfig;
  }

  return config;
}
