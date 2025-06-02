import { PaginationState, SortingState } from "@tanstack/react-table";
import { RuleGroupType } from "react-querybuilder";

import { ChartSeries } from "./chart";
import { ViewOption } from "./data";

export interface ProfilesComponentConfig {
  id: string;
  query?: RuleGroupType;
  order?: "asc" | "desc";
  pagination?: PaginationState;
  sorting?: SortingState;
  selectedView?: ViewOption;
  showPagination?: boolean;
  showTotal?: boolean;
  columnOrder?: string[];
  dateRange?: string;
  dateInterval?: string;
  series?: ChartSeries;
}

export interface ProfilesComponentProps {
  config: ProfilesComponentConfig;
}
