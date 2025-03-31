import { TalentProfile } from "@/app/types/talent";

export interface LeaderboardEntry {
  id: number;
  leaderboard_position: number;
  ranking_change: number;
  reward_amount: string;
  reward_transaction_hash: string | null;
  summary: string | null;
  profile: TalentProfile;
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