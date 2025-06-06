import { ProfilesComponent } from "@/app/components/index/ProfilesComponent";
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

  const componentConfig: ProfilesComponentConfig = {
    id: `profiles-block-${id}`,
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
    columnOrder: columnOrder as string[],
    dateRange: dateRange as string,
    dateInterval: dateInterval as string,
    series: {
      left: leftSeries as ChartSeriesItem[],
      right: rightSeries as ChartSeriesItem[],
    },
  };

  return (
    <div>
      <h2>{title}</h2>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfilesComponent config={componentConfig} />
      </HydrationBoundary>
    </div>
  );
};
