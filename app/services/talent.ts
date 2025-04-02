import { TalentProfileResponse } from "@/app/types/talent";

export async function fetchUserByFid(fid: number): Promise<TalentProfileResponse> {
  const url = `/api/talent/profile?fid=${fid}`;
  
  const response = await fetch(url, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user data: ${response.statusText}`);
  }

  return response.json();
} 