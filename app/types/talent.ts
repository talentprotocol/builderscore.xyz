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

export type PassportCredential = {
  id: number;
  type: string;
  value: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type TalentProfileResponse = {
  passport: TalentProfile | null;
  hasGithubCredential: boolean;
}; 