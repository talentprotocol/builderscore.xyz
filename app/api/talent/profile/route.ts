import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { APITalentProfile, TalentSocialsResponse } from "@/app/types/talent";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const fetchTalentProfile = unstable_cache(
  async (fid: string) => {
    const profileResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (!profileResponse.ok) {
      throw new Error(
        `Talent Protocol API error: ${profileResponse.statusText}`,
      );
    }

    return profileResponse.json();
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentSocials = unstable_cache(
  async (fid: string): Promise<TalentSocialsResponse | null> => {
    const socialsResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (!socialsResponse.ok) {
      return null;
    }

    return socialsResponse.json();
  },
  [CACHE_TAGS.TALENT_SOCIALS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentAccounts = unstable_cache(
  async (fid: string) => {
    const accountResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.accounts}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (!accountResponse.ok) {
      return null;
    }

    return accountResponse.json();
  },
  [CACHE_TAGS.TALENT_ACCOUNTS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentCredentials = unstable_cache(
  async (fid: string) => {
    const credentialsResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.credentials}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (!credentialsResponse.ok) {
      return null;
    }

    return credentialsResponse.json();
  },
  [CACHE_TAGS.TALENT_CREDENTIALS],
  { revalidate: CACHE_60_MINUTES },
);

const fetchTalentBuilderScore = unstable_cache(
  async (fid: string) => {
    const builderScoreResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.builderScore}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      },
    );

    if (!builderScoreResponse.ok) {
      return null;
    }

    return builderScoreResponse.json();
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
    ] = await Promise.all([
      fetchTalentProfile(fid),
      fetchTalentSocials(fid),
      fetchTalentBuilderScore(fid),
      fetchTalentAccounts(fid),
      fetchTalentCredentials(fid),
    ]);

    if (
      !profileData.profile ||
      !socialsData ||
      !builderScoreData ||
      !accountsData ||
      !credentialsData
    ) {
      return NextResponse.json({ profile: null });
    }

    const farcasterSocial = socialsData.socials.find(
      (social: { source: string }) => social.source === "farcaster",
    );

    if (farcasterSocial) {
      const matchingProfile: APITalentProfile = profileData.profile;

      const hasGithubCredential = socialsData.socials.some(
        (social: { source: string }) => social.source === "github",
      );

      const basenameSocial = socialsData.socials.find(
        (social: { source: string; name: string }) =>
          social.source === "basename",
      );

      const hasSelfXyzAccount = accountsData.accounts.some(
        (account: { source: string }) => account.source === "self",
      );

      const hasCeloTransactionCredential = credentialsData.credentials.some(
        (credential: { slug: string }) =>
          credential.slug === "celo_out_transactions",
      );

      return NextResponse.json({
        profile: matchingProfile,
        github: hasGithubCredential,
        basename: basenameSocial?.name,
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
