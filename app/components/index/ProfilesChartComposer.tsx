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
import {
  ChartSeries,
  ChartSeriesItem,
  DataPointDefinition,
} from "@/app/types/index/chart";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ChartLine, GripVertical } from "lucide-react";
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
];

const SortableSeries = ({ item }: { item: ChartSeriesItem }) => {
  return (
    <SortableItem key={item.key} value={item.key} asChild>
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="dropdown-menu-item-style flex cursor-pointer items-center justify-between gap-2 pl-1"
      >
        <div className="flex flex-1 items-center gap-2">
          <SortableItemHandle>
            <GripVertical
              size={12}
              className="cursor-grab text-neutral-400 hover:text-neutral-600"
            />
          </SortableItemHandle>
          <span className="truncate">{item.name}</span>
        </div>
      </DropdownMenuItem>
    </SortableItem>
  );
};

const EmptySeries = ({ side }: { side: "left" | "right" }) => {
  return (
    <SortableItem value={`empty-${side}`} asChild>
      <DropdownMenuItem className="dropdown-menu-item-style">
        <span className="text-xs text-neutral-500">No series added</span>
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
    const colorIndex = 1;

    const newItem: ChartSeriesItem = {
      key: dataPoint.name,
      name: dataPoint.name,
      color: chartColors[colorIndex],
      type: "line",
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
      <DropdownMenuContent className="dropdown-menu-style w-80" align="start">
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
              <SortableSeries key={item.key} item={item} />
            ))}

            {leftAxis.length === 0 && <EmptySeries side="left" />}
            <DropdownMenuSeparator className="bg-neutral-700" />
          </SortableContent>

          <SortableContent withoutSlot containerId="right">
            <DropdownMenuLabel className="text-xs">
              Right Axis
            </DropdownMenuLabel>
            {rightAxis.map((item) => (
              <SortableSeries key={item.key} item={item} />
            ))}

            {rightAxis.length === 0 && <EmptySeries side="right" />}
            <DropdownMenuSeparator className="bg-neutral-700" />
          </SortableContent>
          <SortableOverlay>
            {({ value }) => {
              const item = [...leftAxis, ...rightAxis].find(
                (i) => i.key === value,
              );
              return item ? <SortableSeries item={item} /> : null;
            }}
          </SortableOverlay>
        </Sortable>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="dropdown-menu-item-style">
            Add Series
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="dropdown-menu-style p-0">
            <Command>
              <CommandInput
                placeholder="Search"
                autoFocus={true}
                className="h-9"
              />
              <CommandList className="dropdown-menu-style">
                <CommandEmpty>No label found.</CommandEmpty>
                <CommandGroup>
                  {availableToAdd.map((dataPoint) => (
                    <CommandItem
                      key={dataPoint.name}
                      value={dataPoint.name}
                      onSelect={() => {
                        addDataPoint(dataPoint);
                        setOpen(false);
                      }}
                      className="dropdown-menu-item-style"
                    >
                      {dataPoint.data_provider} -{" "}
                      {dataPoint.name.split("_").slice(1).join(" ")}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
