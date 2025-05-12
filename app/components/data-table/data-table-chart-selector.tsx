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
import { getChartDateRangeStateParser } from "@/app/lib/data-table/parsers";
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
  name: string;
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
  const [showDateRangePicker, setShowDateRangePicker] = React.useState(false);
  const dateRangePickerId = "chart-date-range-picker";

  const allDatapoints = React.useMemo(() => {
    const datapoints: {
      issuer: string;
      datapoint: string;
      id: string;
      name: string;
    }[] = [];

    CHART_DATAPOINTS.forEach((item) => {
      item.dataPoints.forEach((datapoint) => {
        datapoints.push({
          issuer: item.dataIssuer,
          datapoint: datapoint.value,
          name: datapoint.name,
          id: `${item.dataIssuer}:${datapoint.value}`,
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

  const [dateRange, setDateRange] = useQueryState(
    "chartDateRange",
    getChartDateRangeStateParser()
      .withDefault({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        to: new Date().toISOString(),
      })
      .withOptions({
        clearOnDefault: false,
        shallow,
        throttleMs,
      }),
  );

  const onDatapointAdd = () => {
    if (allDatapoints.length === 0) return;

    const firstDatapoint = allDatapoints[0];

    const newDatapoint: ChartDataPoint = {
      id: generateId({ length: 8 }),
      dataIssuer: firstDatapoint.issuer,
      dataPoint: firstDatapoint.datapoint,
      name: firstDatapoint.name,
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

  const formatDateRangeDisplay = () => {
    if (!dateRange.from && !dateRange.to) {
      return "Select date range";
    }

    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      return `${formatDate(fromDate.toISOString())} - ${formatDate(toDate.toISOString())}`;
    }

    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      return `From ${formatDate(fromDate.toISOString())}`;
    }

    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      return `To ${formatDate(toDate.toISOString())}`;
    }

    return "Select date range";
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
          className="border-style flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3 p-3"
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
                Add data points to visualize.
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Popover
              open={showDateRangePicker}
              onOpenChange={setShowDateRangePicker}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between rounded font-normal"
                  aria-controls={dateRangePickerId}
                >
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span className="truncate">{formatDateRangeDisplay()}</span>
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
                  selected={{
                    from: dateRange.from ? new Date(dateRange.from) : undefined,
                    to: dateRange.to ? new Date(dateRange.to) : undefined,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange({
                        from: range.from.toISOString(),
                        to: range.to
                          ? range.to.toISOString()
                          : range.from.toISOString(),
                      });
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

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
  allDatapoints: {
    issuer: string;
    datapoint: string;
    id: string;
    name: string;
  }[];
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

  const datapointId = `${datapoint.dataIssuer}:${datapoint.dataPoint}`;
  const datapointSelectorId = `chart-datapoint-${datapoint.id}-selector`;

  const groupedDatapoints = React.useMemo(() => {
    const groups: Record<
      string,
      { datapoint: string; id: string; name: string }[]
    > = {};

    allDatapoints.forEach((item) => {
      if (!groups[item.issuer]) {
        groups[item.issuer] = [];
      }

      groups[item.issuer].push({
        datapoint: item.datapoint,
        id: item.id,
        name: item.name,
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

      if (showDatapointSelector) {
        return;
      }

      if (["backspace", "delete"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        onDatapointRemove(datapoint.id);
      }
    },
    [datapoint.id, showDatapointSelector, onDatapointRemove],
  );

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
              className="flex-1 justify-between rounded font-normal"
            >
              <span className="truncate">{datapoint.name}</span>
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
                              name: item.name,
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
                          <span className="truncate">{item.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ),
                )}
              </CommandList>
            </Command>
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
