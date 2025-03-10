export type TalentPassportProfile = {
  bio: string;
  display_name: string;
  image_url: string;
  location: string;
  name: string;
  tags: string[];
};

export type TalentProfile = {
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
  passport_profile: TalentPassportProfile;
  score: number;
  skills_score: number;
  socials_calculated_at: string;
  verified: boolean;
  verified_wallets: string[];
};

export type TalentProfileResponse = {
  passports: TalentProfile[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    total_for_page: number;
    point_in_time_id: string | null;
    search_after: string | null;
  };
  cache: {
    cache_used: boolean;
    cache_key: string | null;
  };
}; 