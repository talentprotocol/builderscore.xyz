import { ProfilesComponent } from "@/app/components/index/ProfilesComponent";
import { COLUMN_ORDER } from "@/app/lib/constants";
import { getQueryClient } from "@/app/lib/get-query-client";
import { ChartSeriesItem } from "@/app/types/index/chart";
import { ViewOption } from "@/app/types/index/data";
import { ProfilesComponentConfig } from "@/app/types/index/profiles-component";
import { Profiles as ProfilesProps } from "@/payload-types";
import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { RuleGroupType } from "react-querybuilder";

export const ProfilesBlock = (props: ProfilesProps) => {
  const {
    id,
    title,
    description,
    query,
    order,
    pageIndex,
    pageSize,
    selectedView,
    showPagination,
    showTotal,
    columnOrder,
    dateRange,
    dateInterval,
    leftSeries,
    rightSeries,
  } = props;
  const queryClient = getQueryClient();

  const leftSeriesData = leftSeries?.map((item) => item.series).flat();
  const rightSeriesData = rightSeries?.map((item) => item.series).flat();

  // Create columnVisibility based on columnOrder
  const orderedColumns = columnOrder
    ?.map((item) => item.column)
    .filter(Boolean) as string[];

  const columnVisibility = COLUMN_ORDER.reduce(
    (acc, columnId) => {
      // Hide columns that are not in the columnOrder, show ones that are
      acc[columnId] = orderedColumns.includes(columnId);
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const componentConfig: ProfilesComponentConfig = {
    id: `profiles-block-${id}`,
    title,
    description: description ?? undefined,
    query: query as RuleGroupType | undefined,
    selectedView: selectedView as ViewOption,
    order: order as "asc" | "desc",
    pagination: {
      pageIndex: pageIndex as number,
      pageSize: pageSize as number,
    },
    sorting: [{ id: "builder_score", desc: true }],
    showPagination: showPagination as boolean,
    showTotal: showTotal as boolean,
    columnOrder: orderedColumns,
    columnVisibility,
    dateRange: dateRange as string,
    dateInterval: dateInterval as string,
    series: {
      left: leftSeriesData as ChartSeriesItem[],
      right: rightSeriesData as ChartSeriesItem[],
    },
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilesComponent config={componentConfig} />
    </HydrationBoundary>
  );
};
