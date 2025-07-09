export type TalentBuilderScore = {
  points: number;
  last_calculated_at: string;
};

export interface TalentSocial {
  followers_count: number | null;
  following_count: number | null;
  location: string | null;
  bio: string | null;
  display_name: string;
  profile_image_url: string | null;
  profile_url: string;
  social_name: string;
  social_slug: string;
  source: string;
  handle: string;
  owned_since: string | null;
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
  profile: TalentProfileApi;
  github: boolean;
  basename: string | null;
  builderScore: TalentBuilderScore | null;
  selfXyz: boolean;
  celoTransaction: boolean;
};

export interface TalentSocialsResponse {
  socials: TalentSocial[];
}

export interface TalentCredentialsResponse {
  credentials: TalentCredential[];
}

export interface TalentCredential {
  account_source: string;
  calculating_score: boolean;
  category: string;
  data_issuer_name: string;
  data_issuer_slug: string;
  description: string;
  external_url: string;
  immutable: boolean;
  last_calculated_at: string;
  max_score: number;
  name: string;
  points: number;
  slug: string;
  uom: string;
  updated_at: string;
}

export interface TalentProjectsResponse {
  projects: TalentProject[];
}

export interface TalentProject {
  name: string;
  slug: string;
  project_url: string;
}
