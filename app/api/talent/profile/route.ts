import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { TalentProfileApi, TalentSocialsResponse } from "@/app/types/talent";
import axios, { AxiosError } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchTalentProfile = unstable_cache(
  async (fid: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${fid}&account_source=farcaster`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentSocials = unstable_cache(
  async (fid: string): Promise<TalentSocialsResponse | null> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${fid}&account_source=farcaster`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch {
      return null;
    }
  },
  [CACHE_TAGS.TALENT_SOCIALS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentAccounts = unstable_cache(
  async (fid: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.accounts}?id=${fid}&account_source=farcaster`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch {
      return null;
    }
  },
  [CACHE_TAGS.TALENT_ACCOUNTS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentCredentials = unstable_cache(
  async (fid: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.credentials}?id=${fid}&account_source=farcaster`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch {
      return null;
    }
  },
  [CACHE_TAGS.TALENT_CREDENTIALS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentCredentialsDatapoints = unstable_cache(
  async (fid: string, slug: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.credentialsDatapoints}?id=${fid}&account_source=farcaster&slugs=${slug}`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch {
      return null;
    }
  },
  [CACHE_TAGS.TALENT_CREDENTIALS_DATAPOINTS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentBuilderScore = unstable_cache(
  async (fid: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${ENDPOINTS.talent.builderScore}?id=${fid}&account_source=farcaster`,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      return response.data;
    } catch {
      return null;
    }
  },
  [CACHE_TAGS.TALENT_BUILDER_SCORE],
  { revalidate: CACHE_60_MINUTES },
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 },
    );
  }

  try {
    const [
      profileData,
      socialsData,
      builderScoreData,
      accountsData,
      credentialsData,
      celoOutTransactionsData,
    ] = await Promise.all([
      fetchTalentProfile(fid),
      fetchTalentSocials(fid),
      fetchTalentBuilderScore(fid),
      fetchTalentAccounts(fid),
      fetchTalentCredentials(fid),
      fetchTalentCredentialsDatapoints(fid, "celo_out_transactions"),
    ]);

    if (
      !profileData.profile ||
      !socialsData ||
      !builderScoreData ||
      !accountsData ||
      !credentialsData ||
      !celoOutTransactionsData
    ) {
      return NextResponse.json({ profile: null });
    }

    const farcasterSocial = socialsData.socials.find(
      (social: { source: string }) => social.source === "farcaster",
    );

    if (farcasterSocial) {
      const matchingProfile: TalentProfileApi = profileData.profile;

      const hasGithubCredential = socialsData.socials.some(
        (social: { source: string }) => social.source === "github",
      );

      const basenameSocial = socialsData.socials.find(
        (social: { source: string; handle: string }) =>
          social.source === "basename",
      );

      const hasSelfXyzAccount = accountsData.accounts.some(
        (account: { source: string }) => account.source === "self",
      );

      const hasCeloTransactionCredential =
        celoOutTransactionsData?.data_points.some(
          (datapoint: { credential_slug: string; readable_value: string }) =>
            datapoint.credential_slug === "celo_out_transactions" &&
            parseInt(datapoint.readable_value, 10) > 0,
        );

      return NextResponse.json({
        profile: matchingProfile,
        github: hasGithubCredential,
        basename: basenameSocial?.handle,
        builderScore: builderScoreData?.score,
        selfXyz: hasSelfXyzAccount,
        celoTransaction: hasCeloTransactionCredential,
      });
    }

    return NextResponse.json({ profile: null });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 },
    );
  }
}
