import { DEFAULT_HEADERS } from "@/app/config/api";
import { ENDPOINTS } from "@/app/config/api";
import { API_BASE_URL } from "@/app/config/api";
import { CACHE_TAGS } from "@/app/lib/cache-utils";
import { CACHE_60_MINUTES } from "@/app/lib/cache-utils";
import { formatQuery } from "@/app/lib/format-queries";
import { unstable_cache } from "@/app/lib/unstable-cache";
import axios from "axios";
import { RuleGroupType } from "react-querybuilder";

export const searchProfiles = unstable_cache(
  async function (query: RuleGroupType) {
    const formattedQuery = formatQuery(query);

    const encodedParams = Object.entries(formattedQuery)
      .map(([key, value]) => {
        let encodedValue = encodeURIComponent(JSON.stringify(value));
        encodedValue = encodedValue.replace(/%20/g, "+");
        return `${key}=${encodedValue}`;
      })
      .join("&");

    const response = await axios.get(
      `${API_BASE_URL}${ENDPOINTS.talent.searchProfiles}?${encodedParams}`,
      {
        headers: DEFAULT_HEADERS,
      },
    );

    return response.data;
  },
  [CACHE_TAGS.SEARCH],
  { revalidate: CACHE_60_MINUTES },
);
