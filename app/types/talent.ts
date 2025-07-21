import { AdvancedPagination, Pagination } from "@/app/types/api";

//
// Talent Scores

export interface TalentIndividualScore {
  points: number;
  last_calculated_at: string;
}

export interface TalentScore extends TalentIndividualScore {
  slug: string;
}

export interface TalentScoreResponse {
  score: TalentScore;
}

//
// Talent Socials

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

export interface TalentSocialsResponse {
  socials: TalentSocial[];
}

//
// Talent Accounts

export interface TalentAccount {
  identifier: string;
  source: string;
  owned_since: string;
  connected_at: string;
  username: string | null;
}

export interface TalentAccountsResponse {
  accounts: TalentAccount[];
}

//
// Talent Credentials

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
  points_calculation_logic?: {
    points: number;
    max_points: number;
    data_points: TalentDataPoint[];
    points_description: string;
    points_number_calculated: number;
  };
  slug: string;
  uom: string;
  updated_at: string;
}

export interface TalentCredentialsResponse {
  credentials: TalentCredential[];
}

//
// Talent Data Points

export interface TalentDataPoint {
  id: number;
  name: string;
  value: string;
  is_maximum: boolean;
  multiplier: number;
  readable_value: string;
  multiplication_result: string;
  credential_slug: string;
}

export interface TalentDataPointsResponse {
  data_points: TalentDataPoint[];
}

//
// Talent Projects

export interface TalentProject {
  name: string;
  slug: string;
  project_url: string;
}

export interface TalentProjectsResponse {
  projects: TalentProject[];
}

//
// Talent Contributed Projects

export interface TalentContributedProject {
  name: string;
  slug: string;
  project_url: string;
}

export interface TalentContributedProjectsResponse {
  projects: TalentContributedProject[];
  pagination: Pagination;
}

//
// Talent Profiles

export interface TalentBasicProfile {
  id: string;
  bio: string | null;
  display_name: string | null;
  image_url: string | null;
  location: string | null;
  name: string | null;
  human_checkmark: boolean;
  tags: string[];
}

export interface TalentProfile extends TalentBasicProfile {
  main_wallet_address: string | null;
  farcaster_primary_wallet_address: string | null;
  onchain_since: string;
  ens: string;
}

export interface TalentSearchProfile extends TalentBasicProfile {
  created_at: string;
  calculating_score: boolean;
  verified_nationality: boolean;
  builder_score: TalentIndividualScore;
  scores: TalentScore[];
}

export interface TalentProfileResponse {
  profile: TalentProfile;
}

export interface TalentUsableProfile {
  profile: TalentProfile;
  builder_score: TalentIndividualScore;
}

export interface TalentSearchProfileResponse {
  profiles: TalentSearchProfile[];
  pagination: AdvancedPagination;
}
