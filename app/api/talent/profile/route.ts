import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, ENDPOINTS, DEFAULT_HEADERS } from '@/app/config/api';
import { PassportCredential, TalentProfile } from '@/app/types/talent';

// TODO: Until we ensure that the search API returns the Profile for a given FID,
// we need to fetch the credentials for each passport and match the FID.
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

    if (!profileResponse.ok) {
      throw new Error(`Talent Protocol API error: ${profileResponse.statusText}`);
    }

    const profileData = await profileResponse.json();
    
    if (!profileData.passports?.length) {
      return NextResponse.json({ passport: null });
    }

    for (const passport of profileData.passports) {
      const credentialsResponse = await fetch(
        `${API_BASE_URL}${ENDPOINTS.talent.credentials}?passport_id=${passport.passport_id}`,
        {
          method: "GET",
          headers: DEFAULT_HEADERS,
        }
      );

      if (!credentialsResponse.ok) {
        continue;
      }

      const credentialsData = await credentialsResponse.json();

      const farcasterCredential = credentialsData.passport_credentials.find(
        (cred: PassportCredential) => {
          if (cred.type !== "farcaster") return false;
          const fids = cred.value.replace('FID: ', '').split(',').map(f => f.trim());
          return fids.includes(fid);
        }
      );

      if (farcasterCredential) {
        const matchingPassport: TalentProfile = passport;
        return NextResponse.json({ passport: matchingPassport });
      }
    }

    return NextResponse.json({ passport: null });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch Talent Protocol profile: ${error}` },
      { status: 500 }
    );
  }
} 