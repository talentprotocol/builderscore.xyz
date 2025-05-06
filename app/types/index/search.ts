import { TalentProfileSearchApi } from "@/app/types/talent";

export type SearchQuery = {
  credentials?: {
    name: string;
    dataIssuer: string;
    category?: string;
    valueRange?: { min: number; max: number };
    pointsRange?: { min: number; max?: number };
  }[];
  humanCheckmark?: boolean | null;
  score?: {
    min: number;
    max: number;
  };
  location?: string;
  tags?: string[];
  walletAddresses?: string[];
  identity?: string;
  exactMatch?: boolean;
  profileIds?: string[];
  mainRole?: string[];
  openTo?: string[];
};

export type SearchSortByOptions = "score" | "id";
export type SearchSortOrder = "asc" | "desc";

export interface SearchData {
  query: SearchQuery;
  sort: {
    [key in SearchSortByOptions]?: {
      order: SearchSortOrder;
      scorer?: "Builder Score";
    };
  };
  page: number;
  per_page: number;
  debug?: string | null | undefined;
  point_in_time_id?: string;
  search_after?: (string | number)[];
  keep_alive_minutes?: number;
}

export interface SearchDataResponse {
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
    point_in_time_id?: string;
    search_after?: (string | number)[];
  };
  profiles: TalentProfileSearchApi[];
  indexed_view?: {
    profiles: Record<string, unknown>[];
  };
}
