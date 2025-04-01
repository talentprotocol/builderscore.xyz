import { LeaderboardEntry, LeaderboardParams, LeaderboardResponse } from "@/app/types/leaderboards";

export async function getLeaderboards(params?: LeaderboardParams): Promise<LeaderboardResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.grant_id) {
    searchParams.append('grant_id', params.grant_id);
  }
  if (params?.sponsor_slug) {
    searchParams.append('sponsor_slug', params.sponsor_slug);
  }
  if (params?.per_page) {
    searchParams.append('per_page', params.per_page.toString());
  }
  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }

  const queryString = searchParams.toString();
  const url = `/api/leaderboards${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    cache: 'force-cache'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboards');
  }

  return response.json();
}

export async function getLeaderboardEntry(userId: string, grantId?: string, sponsorSlug?: string): Promise<LeaderboardEntry> {
  const searchParams = new URLSearchParams();
  if (grantId) {
    searchParams.append('grant_id', grantId);
  }

  if (sponsorSlug) {
    searchParams.append('sponsor_slug', sponsorSlug);
  }

  const queryString = searchParams.toString();
  const url = `/api/leaderboards/${userId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    cache: 'force-cache'
  });
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard entry');
  }

  return response.json();
} 