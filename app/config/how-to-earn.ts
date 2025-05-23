import { AVAILABLE_SPONSORS } from "@/app/types/sponsors";
import { APITalentProfile, TalentBuilderScore } from "@/app/types/talent";

export type SponsorSlug = (typeof AVAILABLE_SPONSORS)[number];

type HowToEarnConfig = {
  [key in SponsorSlug]?: {
    description: string;
    steps: {
      text: string;
      url: string;
      condition: boolean | string | null | number | undefined;
    }[];
  };
};

export const howToEarnConfig = (
  basename: string | null,
  loadingUser: boolean,
  talentProfile: APITalentProfile | null,
  builderScore: TalentBuilderScore | null,
  selfXyzAccount: boolean,
  celoTransaction: boolean,
): HowToEarnConfig => {
  return {
    base: {
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
          condition: !loadingUser && talentProfile?.human_checkmark,
        },
        {
          text: "Increase your Builder Score to 40+",
          url: "https://app.talentprotocol.com/profile",
          condition:
            !loadingUser && builderScore?.points && builderScore?.points >= 40,
        },
      ],
    },
    celo: {
      description:
        "Monthly rewards automatically distributed to the top 100 builders who contribute to the Celo ecosystem through verified smart contracts and public contributions on GitHub.",
      steps: [
        {
          text: "Get your Human Checkmark",
          url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
          condition: !loadingUser && talentProfile?.human_checkmark,
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
    },
  };
};
