export interface Grant {
  id: number;
  start_date: string;
  end_date: string;
  rewards_pool: string;
  token_ticker: string;
  sponsor: {
    id: number;
    name: string;
    slug: string;
    description: string;
    logo_url: string;
    color: string;
    website_url: string;
  };
}

export interface GrantsResponse {
  grants: Grant[];
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export interface GrantParams {
  end_date_after?: string;
  end_date_before?: string;
  sponsor_slug?: string;
  per_page?: number;
  page?: number;
} 