import { ChartSeries } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { RuleGroupType } from "react-querybuilder";

export interface ProfilesComponentConfig {
  id: string;
  title?: string;
  description?: string;
  query?: RuleGroupType;
  order?: "asc" | "desc";
  pagination?: PaginationState;
  sorting?: SortingState;
  selectedView?: ViewOption;
  showPagination?: boolean;
  showTotal?: boolean;
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  dateRange?: string;
  dateInterval?: string;
  series?: ChartSeries;
}

export interface ProfilesComponentProps {
  config: ProfilesComponentConfig;
}
