import { TalentProfileSearchApi } from "@/app/types/talent";

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
