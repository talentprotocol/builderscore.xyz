import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  CredentialType,
  SearchData,
  SearchDataResponse,
} from "@/app/types/index/search";

interface CredentialFilter {
  id: string;
  value: string[];
  variant: string;
  operator: string;
  filterId: string;
}

interface ScoreFilter {
  id: string;
  value: string[];
  variant: string;
  operator: string;
  filterId: string;
}

interface IdentityFilter {
  id: string;
  value: string;
  variant: string;
  operator: string;
  filterId: string;
}

interface TransformedQuery {
  credentials?: CredentialType[];
  score?: {
    min: number;
    max: number;
  };
  identity?: string;
}

export const searchProfiles = unstable_cache(
  async function (
    queryParams: Partial<SearchData> = {},
  ): Promise<SearchDataResponse> {
    const transformedQuery = transformQuery(queryParams.query || {});

    const searchData: SearchData = {
      query: transformedQuery,
      sort: queryParams.sort || {
        score: {
          order: "desc",
          scorer: "Builder Score",
        },
      },
      page: queryParams.page || 1,
      per_page: queryParams.per_page || 250,
      debug: queryParams.debug,
    };

    if (queryParams.point_in_time_id) {
      searchData.point_in_time_id = queryParams.point_in_time_id;
    }

    if (queryParams.search_after) {
      searchData.search_after = queryParams.search_after;
    }

    if (queryParams.keep_alive_minutes) {
      searchData.keep_alive_minutes = queryParams.keep_alive_minutes;
    }

    const encodedParams = Object.entries(searchData)
      .map(([key, value]) => {
        let encodedValue = encodeURIComponent(JSON.stringify(value));
        encodedValue = encodedValue.replace(/%20/g, "+");
        return `${key}=${encodedValue}`;
      })
      .join("&");

    const response = await fetch(
      `${API_BASE_URL}${ENDPOINTS.talent.searchProfiles}?${encodedParams}`,
      {
        headers: DEFAULT_HEADERS,
        next: {
          revalidate: 0,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search profiles");
    }

    const data = await response.json();
    return data;
  },
  [CACHE_TAGS.SEARCH],
  { revalidate: CACHE_60_MINUTES },
);

function transformQuery(query: Record<string, unknown>): TransformedQuery {
  if (!query || typeof query !== "object") {
    return {};
  }

  const result: TransformedQuery = {};

  Object.values(query).forEach((filter: unknown) => {
    if (!filter || typeof filter !== "object") return;

    if (isCredentialFilter(filter)) {
      const credentialValues = filter.value || [];
      const credentials = credentialValues
        .map((credentialStr: string) => {
          try {
            const credential = JSON.parse(credentialStr);
            return {
              dataIssuer: credential.dataIssuer,
              name: credential.dataPoint,
            };
          } catch {
            return null;
          }
        })
        .filter(Boolean) as CredentialType[];

      if (credentials.length > 0) {
        result.credentials = credentials;
      }
    }

    if (isScoreFilter(filter)) {
      const [min, max] = filter.value;
      result.score = {
        min: min ? parseInt(min, 10) : 0,
        max: max ? parseInt(max, 10) : 10000,
      };
    }

    if (isIdentityFilter(filter)) {
      result.identity = filter.value;
    }
  });

  return result;
}

function isCredentialFilter(filter: unknown): filter is CredentialFilter {
  if (
    filter !== null &&
    typeof filter === "object" &&
    "id" in filter &&
    "value" in filter
  ) {
    const typedFilter = filter as Record<string, unknown>;
    return typedFilter.id === "credentials";
  }
  return false;
}

function isScoreFilter(filter: unknown): filter is ScoreFilter {
  if (
    filter !== null &&
    typeof filter === "object" &&
    "id" in filter &&
    "value" in filter
  ) {
    const typedFilter = filter as Record<string, unknown>;
    return (
      typedFilter.id === "builder_score" && Array.isArray(typedFilter.value)
    );
  }
  return false;
}

function isIdentityFilter(filter: unknown): filter is IdentityFilter {
  if (
    filter !== null &&
    typeof filter === "object" &&
    "id" in filter &&
    "value" in filter
  ) {
    const typedFilter = filter as Record<string, unknown>;
    return (
      typedFilter.id === "identity" && typeof typedFilter.value === "string"
    );
  }
  return false;
}
