"use client";

import Chart from "@/app/components/Chart";
import ShowToolsButton from "@/app/components/index/ShowToolsButton";
import { TABLE_HEIGHT } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import { ChartSeries, DataPoint } from "@/app/types/index/chart";
import Image from "next/image";

export default function ProfilesChart({
  data,
  series,
  title,
  description,
  showTools,
  setShowTools,
}: {
  data: DataPoint[];
  series: ChartSeries;
  title?: string;
  description?: string;
  showTools?: boolean;
  setShowTools?: (showTools: boolean) => void;
}) {
  return (
    <div className="card-style">
      <ShowToolsButton showTools={showTools} setShowTools={setShowTools} />

      <div className="pointer-events-none absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center">
        <Image
          src="/images/talent-protocol-logo.png"
          alt="Talent Protocol"
          width={1402}
          height={212}
          className="h-12 w-auto opacity-10"
        />
      </div>

      {(title || description) && (
        <div className="flex flex-col gap-1 p-2">
          {title && <p className="text-xs font-semibold">{title}</p>}
          {description && (
            <p className="max-w-xl text-xs text-neutral-500">{description}</p>
          )}
        </div>
      )}
      <div className={cn("px-3 pt-2 pb-4", TABLE_HEIGHT)}>
        <Chart data={data} series={series} xAxisKey="date" height="100%" />
      </div>
    </div>
  );
}
