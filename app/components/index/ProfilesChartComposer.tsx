"use client";

import { Button } from "@/app/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/app/components/ui/sortable";
import { cn } from "@/app/lib/utils";
import {
  ChartSeries,
  ChartSeriesItem,
  DataPointDefinition,
} from "@/app/types/index/chart";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  ChartArea,
  ChartColumnBig,
  ChartColumnStacked,
  ChartLine,
  GripVertical,
  Sigma,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ProfilesChartComposerProps {
  series: ChartSeries;
  setSeries: (series: ChartSeries) => void;
  availableDataPoints?: DataPointDefinition[];
}

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
];

const chartTypes: ChartSeriesItem["type"][] = [
  "line",
  "column",
  "stacked-column",
  "area",
];

const getChartTypeIcon = (type: ChartSeriesItem["type"]) => {
  switch (type) {
    case "line":
      return ChartLine;
    case "column":
      return ChartColumnBig;
    case "stacked-column":
      return ChartColumnStacked;
    case "area":
      return ChartArea;
    default:
      return ChartLine;
  }
};

const SortableSeries = ({
  item,
  dragging,
  handleDelete,
  handleTypeChange,
  handleCumulativeToggle,
  handleColorChange,
}: {
  item: ChartSeriesItem;
  dragging?: boolean;
  handleDelete: (item: ChartSeriesItem) => void;
  handleTypeChange: (item: ChartSeriesItem) => void;
  handleCumulativeToggle: (item: ChartSeriesItem) => void;
  handleColorChange: (item: ChartSeriesItem) => void;
}) => {
  const ChartTypeIcon = getChartTypeIcon(item.type);

  return (
    <SortableItem key={item.key} value={item.key} asChild>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={cn(
          "flex items-center justify-between gap-2 pl-1",
          dragging
            ? "dropdown-menu-item-style-dragging"
            : "dropdown-menu-item-style-static",
        )}
      >
        <div className="flex w-full justify-between">
          <div className="flex flex-1 items-center gap-2">
            <SortableItemHandle>
              <GripVertical
                size={12}
                className="cursor-grab text-neutral-400 hover:text-neutral-600"
              />
            </SortableItemHandle>
            <span className="w-52 truncate capitalize">
              {item.dataProvider} -{" "}
              {item.name.split("_").slice(1).join(" ").charAt(0) +
                item.name.split("_").slice(1).join(" ").slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleColorChange(item);
              }}
              title="Change series color"
            >
              <div
                className="h-3 w-3 rounded-full border border-neutral-100"
                style={{ backgroundColor: item.color }}
              />
            </button>
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCumulativeToggle(item);
              }}
              title={`Toggle cumulative (currently: ${item.cumulative ? "cumulative" : "daily"})`}
            >
              <Sigma
                size={16}
                className={
                  item.cumulative ? "text-neutral-300" : "text-neutral-600"
                }
              />
            </button>
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTypeChange(item);
              }}
              title={`Change chart type (currently: ${item.type})`}
            >
              <ChartTypeIcon size={16} className="text-neutral-300" />
            </button>
            <button
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(item);
              }}
              title="Delete series"
            >
              <Trash2 size={16} className="text-neutral-600" />
            </button>
          </div>
        </div>
      </DropdownMenuItem>
    </SortableItem>
  );
};

const EmptySeries = ({ side }: { side: "left" | "right" }) => {
  return (
    <SortableItem value={`empty-${side}`} asChild>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <span className="text-xs text-neutral-500">No Series Selected</span>
      </DropdownMenuItem>
    </SortableItem>
  );
};

export default function ProfilesChartComposer({
  series,
  setSeries,
  availableDataPoints = [],
}: ProfilesChartComposerProps) {
  const [open, setOpen] = useState(false);
  const [leftAxis, setLeftAxis] = useState<ChartSeriesItem[]>(series.left);
  const [rightAxis, setRightAxis] = useState<ChartSeriesItem[]>(series.right);

  const availableToAdd = useMemo(() => {
    return availableDataPoints.filter(
      (dp) =>
        !leftAxis.map((item) => item.key).includes(dp.name) &&
        !rightAxis.map((item) => item.key).includes(dp.name),
    );
  }, [availableDataPoints, leftAxis, rightAxis]);

  const addDataPoint = (dataPoint: DataPointDefinition) => {
    const colorIndex =
      (leftAxis.length + rightAxis.length) % chartColors.length;

    const newItem: ChartSeriesItem = {
      key: dataPoint.name,
      name: dataPoint.name,
      dataProvider: dataPoint.data_provider,
      color: chartColors[colorIndex],
      type: "line",
      cumulative: true,
    };

    setLeftAxis([...leftAxis, newItem]);
  };

  const handleMove = (event: {
    activeIndex: number;
    overIndex: number;
    activeContainer?: UniqueIdentifier;
    overContainer?: UniqueIdentifier;
  }) => {
    const { activeIndex, overIndex, activeContainer, overContainer } = event;

    if (!activeContainer || !overContainer) return;

    const containers = {
      left: [...leftAxis],
      right: [...rightAxis],
    };

    const activeItems = containers[activeContainer as keyof typeof containers];
    const overItems = containers[overContainer as keyof typeof containers];
    const activeItem = activeItems[activeIndex];

    if (activeContainer === overContainer) {
      const items = [...activeItems];
      items.splice(activeIndex, 1);
      items.splice(overIndex, 0, activeItem);

      if (activeContainer === "left") {
        setLeftAxis(items);
      } else {
        setRightAxis(items);
      }
    } else {
      const sourceItems = [...activeItems];
      const targetItems = [...overItems];

      sourceItems.splice(activeIndex, 1);

      if (targetItems.length === 0 || overIndex >= targetItems.length) {
        targetItems.push(activeItem);
      } else {
        targetItems.splice(overIndex, 0, activeItem);
      }

      if (activeContainer === "left") {
        setLeftAxis(sourceItems);
        setRightAxis(targetItems);
      } else {
        setRightAxis(sourceItems);
        setLeftAxis(targetItems);
      }
    }
  };

  const handleDelete = (item: ChartSeriesItem) => {
    if (item.key.startsWith("empty-")) {
      return;
    }
    setLeftAxis(leftAxis.filter((i) => i.key !== item.key));
    setRightAxis(rightAxis.filter((i) => i.key !== item.key));
  };

  const handleTypeChange = (item: ChartSeriesItem) => {
    if (item.key.startsWith("empty-")) {
      return;
    }

    const currentIndex = chartTypes.indexOf(item.type);
    const nextIndex = (currentIndex + 1) % chartTypes.length;
    const newType = chartTypes[nextIndex];

    const updateItemType = (items: ChartSeriesItem[]) =>
      items.map((i) => (i.key === item.key ? { ...i, type: newType } : i));

    setLeftAxis(updateItemType(leftAxis));
    setRightAxis(updateItemType(rightAxis));
  };

  const handleCumulativeToggle = (item: ChartSeriesItem) => {
    if (item.key.startsWith("empty-")) {
      return;
    }

    const updateItemCumulative = (items: ChartSeriesItem[]) =>
      items.map((i) =>
        i.key === item.key ? { ...i, cumulative: !i.cumulative } : i,
      );

    setLeftAxis(updateItemCumulative(leftAxis));
    setRightAxis(updateItemCumulative(rightAxis));
  };

  const handleColorChange = (item: ChartSeriesItem) => {
    if (item.key.startsWith("empty-")) {
      return;
    }

    const currentColorIndex = chartColors.indexOf(item.color);
    const nextColorIndex = (currentColorIndex + 1) % chartColors.length;
    const newColor = chartColors[nextColorIndex];

    const updateItemColor = (items: ChartSeriesItem[]) =>
      items.map((i) => (i.key === item.key ? { ...i, color: newColor } : i));

    setLeftAxis(updateItemColor(leftAxis));
    setRightAxis(updateItemColor(rightAxis));
  };

  useEffect(() => {
    setSeries({
      left: leftAxis,
      right: rightAxis,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftAxis, rightAxis]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="button-style text-xs" size="sm">
          <ChartLine className="text-neutral-500" />
          Series
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="dropdown-menu-style w-96"
        align="start"
      >
        <Sortable
          value={{
            left: leftAxis,
            right: rightAxis,
          }}
          getItemValue={(item) => item.key}
          orientation="vertical"
          onMove={handleMove}
          isMultiContainer
        >
          <SortableContent withoutSlot containerId="left">
            <DropdownMenuLabel className="text-xs">Left Axis</DropdownMenuLabel>
            {leftAxis.map((item) => (
              <SortableSeries
                key={item.key}
                item={item}
                handleDelete={handleDelete}
                handleTypeChange={handleTypeChange}
                handleCumulativeToggle={handleCumulativeToggle}
                handleColorChange={handleColorChange}
              />
            ))}

            {leftAxis.length === 0 && <EmptySeries side="left" />}
            <DropdownMenuSeparator className="bg-neutral-700" />
          </SortableContent>

          <SortableContent withoutSlot containerId="right">
            <DropdownMenuLabel className="text-xs">
              Right Axis
            </DropdownMenuLabel>
            {rightAxis.map((item) => (
              <SortableSeries
                key={item.key}
                item={item}
                handleDelete={handleDelete}
                handleTypeChange={handleTypeChange}
                handleCumulativeToggle={handleCumulativeToggle}
                handleColorChange={handleColorChange}
              />
            ))}

            {rightAxis.length === 0 && <EmptySeries side="right" />}
            <DropdownMenuSeparator className="bg-neutral-700" />
          </SortableContent>
          <SortableOverlay>
            {({ value }) => {
              const item = [...leftAxis, ...rightAxis].find(
                (i) => i.key === value,
              );
              return item ? (
                <SortableSeries
                  item={item}
                  dragging={true}
                  handleDelete={handleDelete}
                  handleTypeChange={handleTypeChange}
                  handleCumulativeToggle={handleCumulativeToggle}
                  handleColorChange={handleColorChange}
                />
              ) : null;
            }}
          </SortableOverlay>
        </Sortable>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="dropdown-menu-item-style">
            Add Series
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-0">
            <Command>
              <CommandInput
                placeholder="Search"
                autoFocus={true}
                className="h-9"
              />
              <CommandList className="dropdown-menu-style">
                <CommandEmpty className="px-3 py-2.5 text-xs text-neutral-500">
                  No data points found.
                </CommandEmpty>
                {Object.entries(
                  availableToAdd.reduce(
                    (groups, dataPoint) => {
                      const provider = dataPoint.data_provider;
                      if (!groups[provider]) {
                        groups[provider] = [];
                      }
                      groups[provider].push(dataPoint);
                      return groups;
                    },
                    {} as Record<string, typeof availableToAdd>,
                  ),
                ).map(([provider, dataPoints]) => (
                  <CommandGroup key={provider} heading={provider}>
                    {dataPoints.map((dataPoint) => (
                      <CommandItem
                        key={dataPoint.name}
                        value={dataPoint.name}
                        onSelect={() => {
                          addDataPoint(dataPoint);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="dropdown-menu-item-style capitalize"
                      >
                        {dataPoint.name.split("_").join(" ")}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
