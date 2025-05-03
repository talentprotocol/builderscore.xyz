import { APITalentProfile, TalentProfile } from "@/app/types/talent";

export interface LeaderboardEntry {
  id: number;
  leaderboard_position: number | null;
  ranking_change: number | null;
  reward_amount: string | null;
  reward_transaction_hash: string | null;
  summary: string | null;
  profile: TalentProfile | APITalentProfile;
}

export interface LeaderboardPagination {
  current_page: number;
  last_page: number;
  total: number;
}

export interface LeaderboardResponse {
  users: LeaderboardEntry[];
  pagination: LeaderboardPagination;
}

export interface LeaderboardParams {
  grant_id?: string;
  sponsor_slug?: string;
  per_page?: number;
  page?: number;
}
