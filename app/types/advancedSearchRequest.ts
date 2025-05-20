interface AdvancedSearchRequest {
  query: { customQuery: unknown };
  sort: { score: { order: string }; id: { order: string } };
}

export type { AdvancedSearchRequest };
