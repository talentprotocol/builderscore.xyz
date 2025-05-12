"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/app/components/ui/sortable";
import { CHART_DATAPOINTS } from "@/app/lib/constants";
import { generateId } from "@/app/lib/data-table/id";
import {
  CHART_DATAPOINTS_KEY,
  chartDatapointsParser,
} from "@/app/lib/data-table/parsers";
import { cn, formatDate } from "@/app/lib/utils";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  GripVertical,
  LineChart,
  Trash2,
} from "lucide-react";
import { useQueryState } from "nuqs";
import * as React from "react";

interface ChartDataPoint {
  id: string;
  dataIssuer: string;
  dataPoint: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface DataTableChartSelectorProps
  extends React.ComponentProps<typeof PopoverContent> {
  throttleMs?: number;
  shallow?: boolean;
}

export function DataTableChartSelector({
  throttleMs = 50,
  shallow = true,
  ...props
}: DataTableChartSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const labelId = React.useId();
  const descriptionId = React.useId();
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const allDatapoints = React.useMemo(() => {
    const datapoints: { issuer: string; datapoint: string; id: string }[] = [];

    CHART_DATAPOINTS.forEach((item) => {
      item.dataPoints.forEach((datapoint) => {
        datapoints.push({
          issuer: item.dataIssuer,
          datapoint,
          id: `${item.dataIssuer}:${datapoint}`,
        });
      });
    });

    return datapoints;
  }, []);

  const [selectedDatapoints, setSelectedDatapoints] = useQueryState(
    CHART_DATAPOINTS_KEY,
    chartDatapointsParser.withDefault([]).withOptions({
      clearOnDefault: true,
      shallow,
      throttleMs,
    }),
  );

  const onDatapointAdd = () => {
    if (allDatapoints.length === 0) return;

    const firstDatapoint = allDatapoints[0];
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newDatapoint: ChartDataPoint = {
      id: generateId({ length: 8 }),
      dataIssuer: firstDatapoint.issuer,
      dataPoint: firstDatapoint.datapoint,
      dateRange: {
        from: oneMonthAgo,
        to: now,
      },
    };

    setSelectedDatapoints([...selectedDatapoints, newDatapoint]);
  };

  const onDatapointUpdate = (
    id: string,
    updates: Partial<Omit<ChartDataPoint, "id">>,
  ) => {
    setSelectedDatapoints(
      selectedDatapoints.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  };

  const onDatapointRemove = (id: string) => {
    setSelectedDatapoints(selectedDatapoints.filter((item) => item.id !== id));
    requestAnimationFrame(() => {
      addButtonRef.current?.focus();
    });
  };

  const onResetDatapoints = () => {
    setSelectedDatapoints([]);
  };

  return (
    <Sortable
      value={selectedDatapoints}
      onValueChange={setSelectedDatapoints}
      getItemValue={(item: ChartDataPoint) => item.id}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="button-style text-xs"
            variant="outline"
            size="sm"
            aria-expanded={open}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
          >
            <LineChart className="mr-1 h-4 w-4" />
            Chart Data
            {selectedDatapoints.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono text-[10.4px] font-normal"
              >
                {selectedDatapoints.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          className="border-style flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3 p-3 sm:min-w-[420px]"
          {...props}
        >
          <div className="flex flex-col gap-1">
            <h4 id={labelId} className="text-xs leading-none font-medium">
              {selectedDatapoints.length > 0
                ? "Chart Data"
                : "No chart data selected"}
            </h4>
            {selectedDatapoints.length === 0 && (
              <p id={descriptionId} className="secondary-text-style text-xs">
                Add data points to visualize
              </p>
            )}
          </div>

          {/* Show selected data points */}
          {selectedDatapoints.length > 0 && (
            <SortableContent asChild>
              <div
                role="list"
                className="flex max-h-[300px] flex-col gap-2 overflow-y-auto"
              >
                {selectedDatapoints.map((datapoint) => (
                  <DataTableChartItem
                    key={datapoint.id}
                    datapoint={datapoint}
                    allDatapoints={allDatapoints}
                    onDatapointUpdate={onDatapointUpdate}
                    onDatapointRemove={onDatapointRemove}
                  />
                ))}
              </div>
            </SortableContent>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-2">
            <Button
              ref={addButtonRef}
              size="sm"
              className="button-style text-xs"
              onClick={onDatapointAdd}
            >
              Add Data Point
            </Button>
            {selectedDatapoints.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="button-style text-xs"
                onClick={onResetDatapoints}
              >
                Reset
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 h-8 w-36 rounded-sm" />
          <div className="bg-primary/10 h-8 w-36 rounded-sm" />
          <div className="bg-primary/10 h-8 w-36 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

interface DataTableChartItemProps {
  datapoint: ChartDataPoint;
  allDatapoints: { issuer: string; datapoint: string; id: string }[];
  onDatapointUpdate: (
    id: string,
    updates: Partial<Omit<ChartDataPoint, "id">>,
  ) => void;
  onDatapointRemove: (id: string) => void;
}

function DataTableChartItem({
  datapoint,
  allDatapoints,
  onDatapointUpdate,
  onDatapointRemove,
}: DataTableChartItemProps) {
  const [showDatapointSelector, setShowDatapointSelector] =
    React.useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = React.useState(false);

  const datapointId = `${datapoint.dataIssuer}:${datapoint.dataPoint}`;
  const datapointSelectorId = `chart-datapoint-${datapoint.id}-selector`;
  const dateRangePickerId = `chart-datapoint-${datapoint.id}-date-range`;

  // Group datapoints by issuer for the selector
  const groupedDatapoints = React.useMemo(() => {
    const groups: Record<string, { datapoint: string; id: string }[]> = {};

    allDatapoints.forEach((item) => {
      if (!groups[item.issuer]) {
        groups[item.issuer] = [];
      }

      groups[item.issuer].push({
        datapoint: item.datapoint,
        id: item.id,
      });
    });

    return groups;
  }, [allDatapoints]);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showDatapointSelector || showDateRangePicker) {
        return;
      }

      if (["backspace", "delete"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        onDatapointRemove(datapoint.id);
      }
    },
    [
      datapoint.id,
      showDatapointSelector,
      showDateRangePicker,
      onDatapointRemove,
    ],
  );

  const formatDateRange = () => {
    if (!datapoint.dateRange.from && !datapoint.dateRange.to) {
      return "Select date range";
    }

    if (datapoint.dateRange.from && datapoint.dateRange.to) {
      return `${formatDate(datapoint.dateRange.from.toISOString())} - ${formatDate(datapoint.dateRange.to.toISOString())}`;
    }

    if (datapoint.dateRange.from) {
      return `From ${formatDate(datapoint.dateRange.from.toISOString())}`;
    }

    if (datapoint.dateRange.to) {
      return `To ${formatDate(datapoint.dateRange.to.toISOString())}`;
    }

    return "Select date range";
  };

  return (
    <SortableItem value={datapoint.id} asChild>
      <div
        role="listitem"
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        <Popover
          open={showDatapointSelector}
          onOpenChange={setShowDatapointSelector}
        >
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-controls={datapointSelectorId}
              variant="outline"
              size="sm"
              className="w-36 justify-between rounded font-normal"
            >
              <span className="truncate">{datapoint.dataPoint}</span>
              <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={datapointSelectorId}
            align="start"
            className="w-[220px] origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Command>
              <CommandInput placeholder="Search data points..." />
              <CommandList>
                <CommandEmpty>No data points found.</CommandEmpty>
                {Object.entries(groupedDatapoints).map(
                  ([issuer, datapoints]) => (
                    <CommandGroup key={issuer} heading={issuer}>
                      {datapoints.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            const [issuer, dataPoint] = item.id.split(":");
                            onDatapointUpdate(datapoint.id, {
                              dataIssuer: issuer,
                              dataPoint,
                            });
                            setShowDatapointSelector(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              item.id === datapointId
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          <span className="truncate">{item.datapoint}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover
          open={showDateRangePicker}
          onOpenChange={setShowDateRangePicker}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-36 justify-between rounded font-normal"
              aria-controls={dateRangePickerId}
            >
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span className="truncate">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={dateRangePickerId}
            align="start"
            className="w-auto origin-[var(--radix-popover-content-transform-origin)] p-0"
          >
            <Calendar
              mode="range"
              initialFocus
              selected={datapoint.dateRange}
              onSelect={(range) => {
                onDatapointUpdate(datapoint.id, {
                  dateRange: {
                    from: range?.from,
                    to: range?.to || range?.from,
                  },
                });
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded"
          onClick={() => onDatapointRemove(datapoint.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <SortableItemHandle asChild>
          <Button variant="outline" size="icon" className="size-8 rounded">
            <GripVertical className="h-4 w-4" />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  );
}
