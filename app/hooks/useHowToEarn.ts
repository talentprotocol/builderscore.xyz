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
    "celo_out_transactions",
  );

  const basenameSocial = socialsData?.socials.find(
    (social: TalentSocial) => social.source === "basename",
  );

  const selfXyzAccount = accountsData?.accounts.find(
    (account: TalentAccount) => account.source === "self",
  );

  const celoOutTransactionsCredential = celoCredentialData?.data_points.find(
    (datapoint: TalentDataPoint) =>
      datapoint.credential_slug === "celo_out_transactions",
  );

  const basename = basenameSocial?.handle;
  const humanCheckmark = userProfileData?.profile.human_checkmark;
  const builderScore = builderScoreData?.score;

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
        text: "Connect a wallet with at least 1 outgoing TX on Celo to your Talent profile",
        url: "https://app.talentprotocol.com/accounts",
        condition: !loadingUser && !!celoOutTransactionsCredential,
        required: true,
      },
      {
        text: "Get your Human Checkmark (1 valid KYC on Talent profile)",
        url: "https://docs.talentprotocol.com/docs/protocol-concepts/human-checkmark",
        condition: !loadingUser && !!humanCheckmark,
        required: true,
      },
      {
        text: "Connect your KarmaGAP wallet address to your Talent profile (mandatory for Proof of Ship Builders)",
        url: "https://app.talentprotocol.com/accounts",
        condition: false,
        required: false,
      },
      {
        text: "Earn more by verifying your humanity with Self.xyz (optional)",
        url: "https://app.talentprotocol.com/accounts",
        condition: !loadingUser && !!selfXyzAccount,
        required: false,
      },
    ],
  };

  const reownConfig = {
    description:
      "Reown distributes weekly rewards to Base builders building with WalletKit that own verified contracts on Base and contribute to public crypto repositories on GitHub.",
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
      {
        text: "Connect your Reown email address to your Talent profile",
        url: "https://app.talentprotocol.com/accounts",
        condition: false,
        required: false,
      },
      {
        text: "Integrate any of Reown's WalletKit packages (Web, iOS, Android, Flutter, React Native or .NET) in your app",
        url: "https://docs.reown.com/walletkit/overview",
        condition: false,
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
    case "reown":
      config = reownConfig;
      break;
    default:
      config = baseConfig;
  }

  return config;
}
