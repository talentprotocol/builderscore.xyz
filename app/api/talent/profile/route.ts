import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { TalentProfile, TalentSocialsResponse } from '@/app/types/talent';
import { unstable_cache } from '@/app/lib/unstable-cache';
import { CACHE_TAGS, CACHE_60_MINUTES } from '@/app/lib/cache-utils';

const fetchTalentProfile = unstable_cache(
  async (queryString: string) => {
    const profileResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?${queryString}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS
      }
    );

    if (!profileResponse.ok) {
      throw new Error(`Talent Protocol API error: ${profileResponse.statusText}`);
    }

    return profileResponse.json();
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES }
);

const fetchTalentSocials = unstable_cache(
  async (profileId: string): Promise<TalentSocialsResponse | null> => {
    const socialsResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${profileId}&account_source=farcaster`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS
      }
    );

    if (!socialsResponse.ok) {
      return null;
    }

    return socialsResponse.json();
  },
  ['talent-socials'],
  { revalidate: 60 * 60 }
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
    const queryObject = {
      query: {
        identity: `farcaster:${fid}`,
        exactMatch: true,
      },
      sort: {
        score: {
          order: "desc",
          scorer: "Builder Score",
        },
      }
    };

    const queryString = Object.keys(queryObject)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(
            JSON.stringify(queryObject[key as keyof typeof queryObject])
          )}`
      )
      .join("&");

    const profileData = await fetchTalentProfile(queryString);
    
    if (!profileData.profiles?.length) {
      return NextResponse.json({ profile: null });
    }

    for (const profile of profileData.profiles as TalentProfile[]) {
      const socialsData = await fetchTalentSocials(profile.id);
      
      if (!socialsData) {
        continue;
      }
      
      const farcasterSocial = socialsData.socials.find(
        (social: { source: string }) => social.source === 'farcaster'
      );

      if (farcasterSocial) {
        const matchingProfile: TalentProfile = profile;

        const hasGithubCredential = socialsData.socials.some(
          (social: { source: string }) => social.source === 'github'
        );

        const hasBasenameCredential = socialsData.socials.some(
          (social: { source: string }) => social.source === 'basename'
        );

        const basenameSocial = socialsData.socials.find(
          (social: { source: string; name: string }) => social.source === 'basename'
        );

        return NextResponse.json({
          profile: matchingProfile,
          hasGithubCredential,
          hasBasenameCredential,
          basename: basenameSocial?.name
        });
      }
    }

    return NextResponse.json({ profile: null });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 }
    );
  }
} 