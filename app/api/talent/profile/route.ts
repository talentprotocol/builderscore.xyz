import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { TalentProfile, TalentSocialsResponse } from '@/app/types/talent';

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

    const profileResponse = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.profile}?${queryString}`,
      {
        method: "GET",
        headers: DEFAULT_HEADERS,
      }
    );

    console.log(`${API_BASE_URL}${ENDPOINTS.talent.profile}?${queryString}`);
    console.log("profileResponse", profileResponse);

    if (!profileResponse.ok) {
      throw new Error(`Talent Protocol API error: ${profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();
    
    if (!profileData.profiles?.length) {
      return NextResponse.json({ profile: null });
    }

    for (const profile of profileData.profiles as TalentProfile[]) {
      const socialsResponse = await fetch(
        `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${profile.id}&account_source=farcaster`,
        {
          method: "GET",
          headers: DEFAULT_HEADERS,
        }
      );

      if (!socialsResponse.ok) {
        continue;
      }

      const socialsData: TalentSocialsResponse = await socialsResponse.json();
      
      const farcasterSocial = socialsData.socials.find(
        social => social.source === 'farcaster'
      );

      if (farcasterSocial) {
        const matchingProfile: TalentProfile = profile;
        const hasGithubCredential = socialsData.socials.some(
          social => social.source === 'github'
        );

        return NextResponse.json({
          profile: matchingProfile,
          hasGithubCredential,
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