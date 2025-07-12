import { TalentProfile, TalentProfileApi } from "@/app/types/talent";

export interface LeaderboardEntry {
  id: number;
  distributed_at: string | null;
  hall_of_fame: boolean;
  leaderboard_position: number | null;
  metrics: LeaderboardMetric[];
  profile: TalentProfile | TalentProfileApi;
  ranking_change: number | null;
  recipient_wallet: string | null;
  reward_amount: string | null;
  reward_transaction_hash: string | null;
  summary: string | null;
}

export interface LeaderboardMetric {
  id: number;
  category: string;
  metric_name: string;
  raw_value: number;
}

interface LeaderboardPagination {
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
