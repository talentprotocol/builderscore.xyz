import { TalentProfileResponse, APITalentProfile } from "@/app/types/talent";

export async function fetchUserByFid(
  fid: number,
): Promise<TalentProfileResponse> {
  const url = `/api/talent/profile?fid=${fid}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }

  return response.json();
}

export interface ProfileLookupResponse {
  profile:
    | (APITalentProfile & {
        ens?: string;
        onchain_since?: string;
      })
    | null;
}

export async function fetchProfileById(
  id: string,
  accountSource: "farcaster" | "github" | "wallet" = "wallet",
): Promise<ProfileLookupResponse> {
  const url = `/api/talent/lookup?id=${encodeURIComponent(id)}&account_source=${accountSource}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile data: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchProfilesByIds(
  ids: string[],
  accountSource: "farcaster" | "github" | "wallet" = "wallet",
): Promise<ProfileLookupResponse[]> {
  const promises = ids.map((id) => fetchProfileById(id, accountSource));
  return Promise.all(promises);
}
