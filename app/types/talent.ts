export type TalentBuilderScore = {
  points: number;
  last_calculated_at: string;
};

export type TalentCredential = {
  id: number;
  type: string;
  value: string;
  verified: boolean;
  created_at: string;
  updated_at: string;
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

export type TalentProfileApi = {
  id: string;
  account: string | null;
  bio: string | null;
  display_name: string | null;
  ens: string;
  human_checkmark: boolean;
  image_url: string | null;
  location: string | null;
  name: string | null;
  onchain_id: number;
  onchain_since: string;
  refreshing_socials: boolean;
  socials_refreshed_at: string;
  tags: string[];
  user: {
    admin: boolean;
    builder_plus: boolean;
    created_at: string;
    email: string | null;
    email_confirmed: boolean;
    human_checkmark: boolean;
    id: string;
    main_wallet: string;
    merged: boolean;
    onchain_id: number;
    rank_position: number;
  };
};

export type TalentProfileSearchApi = {
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
  builder_score?: {
    points: number;
    last_calculated_at: string;
  };
};

export type TalentProfileResponse = {
  profile: TalentProfileApi | null;
  github: boolean;
  basename: string | null;
  builderScore: TalentBuilderScore | null;
  selfXyz: boolean;
  celoTransaction: boolean;
};

export interface TalentSocialsResponse {
  socials: TalentSocial[];
}
