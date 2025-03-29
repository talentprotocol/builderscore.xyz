export interface TalentUser {
  id: string;
  name: string | null;
  profile: TalentProfile;
  profile_picture_url: string;
}

export type TalentProfile = {
  id: string;
  bio: string | null;
  created_at: string;
  display_name: string | null;
  human_checkmark: boolean;
  image_url: string | null;
  location: string | null;
  name: string | null;
  onchain: boolean;
  calculating_score: boolean;
  tags: string[];
  builder_score: {
    points: number;
    last_calculated_at: string;
  } | null;
};

export type TalentCredential = {
  id: number;
  type: string;
  value: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type TalentProfileResponse = {
  profile: TalentProfile | null;
  hasGithubCredential: boolean;
};

export interface TalentSocial {
  follower_count: string;
  following_count: string;
  location: string;
  owner: string;
  bio: string;
  display_name: string;
  image_url: string;
  name: string;
  owned_since: string;
  profile_url: string;
  source: string;
}

export interface TalentSocialsResponse {
  socials: TalentSocial[];
}
