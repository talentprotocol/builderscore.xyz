interface AdvancedSearchRequest {
  query: { customQuery: unknown };
  sort: { score: { order: string }; id: { order: string } };
  page: number;
  per_page: number;
}

export type { AdvancedSearchRequest };
