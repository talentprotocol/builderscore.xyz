"use client";

import { Button } from "@/app/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { VIEW_MODE_KEY, viewModeParser } from "@/app/lib/data-table/parsers";
import { BarChart, Grid } from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

interface DataTableViewToggleProps
  extends React.ComponentProps<typeof PopoverContent> {
  throttleMs?: number;
  shallow?: boolean;
}

export function DataTableViewToggle({
  throttleMs = 50,
  shallow = true,
  ...props
}: DataTableViewToggleProps) {
  const [open, setOpen] = React.useState(false);
  const labelId = React.useId();

  const [viewMode, setViewMode] = useQueryState(
    VIEW_MODE_KEY,
    viewModeParser.withDefault("table").withOptions({
      clearOnDefault: true,
      shallow,
      throttleMs,
    }),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="button-style text-xs" variant="outline" size="sm">
          {viewMode === "table" ? <Grid /> : <BarChart />}
          View Mode
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-labelledby={labelId}
        align="end"
        className="border-style flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3 p-3 sm:min-w-[200px]"
        {...props}
      >
        <div className="flex flex-col gap-2">
          <h4 id={labelId} className="text-xs leading-none font-medium">
            View Mode
          </h4>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "outline"}
              className="button-style flex-1 text-xs"
              onClick={() => setViewMode("table")}
            >
              <Grid className="mr-1 h-4 w-4" />
              Table
            </Button>
            <Button
              size="sm"
              variant={viewMode === "chart" ? "default" : "outline"}
              className="button-style flex-1 text-xs"
              onClick={() => setViewMode("chart")}
            >
              <BarChart className="mr-1 h-4 w-4" />
              Chart
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
