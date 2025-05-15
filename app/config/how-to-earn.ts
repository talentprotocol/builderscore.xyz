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
        "Talent Protocol distributes weekly rewards to builders that own verified contracts on Celo and contribute to public crypto repositories on GitHub. Follow the steps below to be eligible:",
      steps: [
        {
          text: "Get your Self.xyz Account",
          url: "https://self.xyz/verify",
          condition: !loadingUser && selfXyzAccount,
        },
        {
          text: "Increase your Builder Score to 40+",
          url: "https://app.talentprotocol.com/profile",
          condition:
            !loadingUser && builderScore?.points && builderScore?.points >= 40,
        },
      ],
    },
  };
};
