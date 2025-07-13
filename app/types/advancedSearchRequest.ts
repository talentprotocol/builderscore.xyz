interface AdvancedSearchRequest {
  query: { customQuery?: unknown; identity?: string };
  sort: { score: { order: string }; id: { order: string } };
  page: number;
  per_page: number;
}

export type { AdvancedSearchRequest };
