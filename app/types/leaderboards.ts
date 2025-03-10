interface PassportProfile {
  bio: string;
  display_name: string;
  image_url: string;
  location: string | null;
  name: string;
  tags: string[];
}

interface Passport {
  activity_score: number;
  calculating_score: boolean;
  created_at: string;
  human_checkmark: boolean;
  identity_score: number;
  last_calculated_at: string;
  main_wallet: string;
  main_wallet_changed_at: string | null;
  onchain: boolean;
  passport_id: number;
  passport_profile: PassportProfile;
  score: number;
  skills_score: number;
  socials_calculated_at: string;
  verified: boolean;
  verified_wallets: string[];
}

interface User {
  id: string;
  name: string | null;
  passport: Passport;
  profile_picture_url: string;
}

export interface LeaderboardEntry {
  id: number;
  leaderboard_position: number;
  reward_amount: string;
  user: User;
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