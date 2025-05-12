import {
  getChartDatapointsStateParser,
  getChartDateRangeStateParser,
  getFiltersStateParser,
  getSortingStateParser,
} from "@/app/lib/data-table/parsers";
import { type TalentProfileSearchApi } from "@/app/types/talent";
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<TalentProfileSearchApi>().withDefault([
    { id: "builder_score", desc: true },
  ]),
  // Basic filters
  name: parseAsString.withDefault(""),
  display_name: parseAsString.withDefault(""),
  location: parseAsString.withDefault(""),
  human_checkmark: parseAsString.withDefault(""),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  // Advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const statsParamsCache = createSearchParamsCache({
  chartDatapoints: getChartDatapointsStateParser().withDefault([]),
  chartDateRange: getChartDateRangeStateParser().withDefault({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
  }),
});

export type GetProfilesSchema = Awaited<
  ReturnType<typeof searchParamsCache.parse>
>;
