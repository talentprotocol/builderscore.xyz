import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { SearchData, SearchDataResponse } from "@/app/types/index/search";
import { cache } from "react";

export const searchProfiles = cache(async function (
  queryParams: Partial<SearchData> = {},
): Promise<SearchDataResponse> {
  const searchData: SearchData = {
    query: queryParams.query || {},
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
});
