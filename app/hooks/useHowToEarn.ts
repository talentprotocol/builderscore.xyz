import {
  useCurrentTalentProfile,
  useTalentAccounts,
  useTalentBuilderScore,
  useTalentCredentialDatapoints,
  useTalentSocials,
} from "@/app/hooks/useTalent";
import { ALLOWED_SPONSORS } from "@/app/lib/constants";
import { Sponsor } from "@/app/types/rewards/sponsors";
import {
  TalentAccount,
  TalentDataPoint,
  TalentSocial,
} from "@/app/types/talent";

export type SponsorSlug = (typeof ALLOWED_SPONSORS)[number];

type HowToEarnConfig = {
  description: string;
  steps: {
    text: string;
    url: string;
    condition: boolean | string | null | number | undefined;
    required: boolean;
  }[];
};

export function useHowToEarn(sponsor: Sponsor): HowToEarnConfig {
  const { data: userProfileData, isLoading: loadingUser } =
    useCurrentTalentProfile();
  const { data: builderScoreData } = useTalentBuilderScore(
    userProfileData?.profile.id || "",
  );
  const { data: socialsData } = useTalentSocials(
    userProfileData?.profile.id || "",
  );
  const { data: accountsData } = useTalentAccounts(
    userProfileData?.profile.id || "",
  );
  const { data: celoCredentialData } = useTalentCredentialDatapoints(
    userProfileData?.profile.id || "",
    "celo",
  );

  const basenameSocial = socialsData?.socials.find(
    (social: TalentSocial) => social.source === "basename",
  );

  const selfXyzAccount = accountsData?.accounts.find(
    (account: TalentAccount) => account.source === "self",
  );

  const celoCredential = celoCredentialData?.data_points.find(
    (datapoint: TalentDataPoint) => datapoint.credential_slug === "celo",
  );

  const basename = basenameSocial?.handle;
  const humanCheckmark = userProfileData?.profile.human_checkmark;
  const builderScore = builderScoreData?.score;
  const hasSelfXyzAccount = selfXyzAccount?.identifier !== null;
  const hasCeloTransaction = celoCredential?.value !== null;

  const baseConfig = {
    description:
      "Talent Protocol distributes weekly rewards to builders that own verified contracts on Base and contribute to public crypto repositories on GitHub.",
    steps: [
      {
        text: `Own a Basename ${basename ? `(${basename})` : ""}`,
        url: "https://www.base.org/names",
        condition: !loadingUser && basename,
        required: true,
      },
      {
        text: "Increase your Builder Score to 40+",
        url: "https://app.talentprotocol.com/profile",
        condition: !loadingUser && builderScore && builderScore.points >= 40,
        required: true,
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
        required: true,
      },
      {
        text: "Have 1+ outgoing transactions on Celo",
        url: "https://app.talentprotocol.com",
        condition: !loadingUser && hasCeloTransaction,
        required: true,
      },
      {
        text: "Earn more by verifying your humanity with Self.xyz (optional)",
        url: "https://app.talentprotocol.com/accounts",
        condition: !loadingUser && hasSelfXyzAccount,
        required: false,
      },
    ],
  };

  let config: HowToEarnConfig;

  switch (sponsor.slug) {
    case "base-summer":
      config = baseConfig;
      break;
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
