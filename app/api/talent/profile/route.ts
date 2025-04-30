import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from "@/app/config/api";
import { APITalentProfile, TalentSocialsResponse } from "@/app/types/talent";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { CACHE_TAGS, CACHE_60_MINUTES } from "@/app/lib/cache-utils";

export const dynamic = "force-dynamic";

const fetchTalentProfile = unstable_cache(
  async (fid: string) => {
    const profileResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!profileResponse.ok) {
      throw new Error(
        `Talent Protocol API error: ${profileResponse.statusText}`
      );
    }

    return profileResponse.json();
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES }
);

const fetchTalentSocials = unstable_cache(
  async (fid: string): Promise<TalentSocialsResponse | null> => {
    const socialsResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    if (!socialsResponse.ok) {
      return null;
    }

    return socialsResponse.json();
  },
  [CACHE_TAGS.TALENT_SOCIALS],
  { revalidate: CACHE_60_MINUTES }
);

const fetchTalentBuilderScore = unstable_cache(
  async (fid: string) => {
    const builderScoreResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.builderScore}?id=${fid}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      } 
    );

    if (!builderScoreResponse.ok) {
      return null;
    }

    return builderScoreResponse.json();
  },
  [CACHE_TAGS.TALENT_BUILDER_SCORE],
  { revalidate: CACHE_60_MINUTES }
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get("fid");

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const [profileData, socialsData, builderScoreData] = await Promise.all([
      fetchTalentProfile(fid),
      fetchTalentSocials(fid),
      fetchTalentBuilderScore(fid)
    ]);

    if (!profileData.profile || !socialsData || !builderScoreData) {
      return NextResponse.json({ profile: null });
    }

    const farcasterSocial = socialsData.socials.find(
      (social: { source: string }) => social.source === "farcaster"
    );

    if (farcasterSocial) {
      const matchingProfile: APITalentProfile = profileData.profile;

      const hasGithubCredential = socialsData.socials.some(
        (social: { source: string }) => social.source === "github"
      );

      const hasBasenameCredential = socialsData.socials.some(
        (social: { source: string }) => social.source === "basename"
      );

      const basenameSocial = socialsData.socials.find(
        (social: { source: string; name: string }) =>
          social.source === "basename"
      );

      return NextResponse.json({
        profile: matchingProfile,
        hasGithubCredential,
        hasBasenameCredential,
        basename: basenameSocial?.name,
        builderScore: builderScoreData?.score,
      });
    }

    return NextResponse.json({ profile: null });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 }
    );
  }
}
