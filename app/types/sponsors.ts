export interface Sponsor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
}

export interface SponsorsResponse {
  sponsors: Sponsor[];
  total_count: number;
  page: number;
  per_page: number;
} 