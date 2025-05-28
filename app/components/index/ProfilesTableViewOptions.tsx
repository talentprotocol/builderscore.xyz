"use client";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";
import { ViewOption } from "@/app/types/index/data";
import { BarChart3, BookOpen, Check, Hash, Rows3 } from "lucide-react";

interface ProfilesTableViewOptionsProps {
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  showPagination: boolean;
  setShowPagination: (show: boolean) => void;
  showTotal: boolean;
  setShowTotal: (show: boolean) => void;
}

export default function ProfilesTableViewOptions({
  selectedView,
  setSelectedView,
  showPagination,
  setShowPagination,
  showTotal,
  setShowTotal,
}: ProfilesTableViewOptionsProps) {
  const viewOptions = [
    { id: "table" as ViewOption, label: "Table", icon: Rows3 },
    { id: "chart" as ViewOption, label: "Chart", icon: BarChart3 },
  ];

  const selectedViewOption = viewOptions.find(
    (option) => option.id === selectedView,
  );
  const SelectedIcon = selectedViewOption?.icon || Rows3;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="dropdown-menu-item-style">
        <SelectedIcon className="text-neutral-500" />
        View
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="dropdown-menu-style w-48">
          <DropdownMenuLabel className="text-xs">View</DropdownMenuLabel>
          {viewOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedView(option.id);
                }}
                className="dropdown-menu-item-style flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <IconComponent className="size-4 text-neutral-500" />
                  {option.label}
                </span>
                <Check
                  className={cn(
                    "ml-auto size-4 shrink-0",
                    selectedView === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
              </DropdownMenuItem>
            );
          })}

          <DropdownMenuSeparator className="bg-neutral-700" />

          <DropdownMenuLabel className="text-xs">Options</DropdownMenuLabel>

          <DropdownMenuItem
            className="dropdown-menu-item-style flex items-center justify-between"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPagination(!showPagination);
            }}
          >
            <BookOpen className="size-4 text-neutral-500" />
            <span className="flex items-center gap-2">Pagination</span>
            <Check
              className={cn(
                "ml-auto size-4 shrink-0",
                showPagination ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>

          <DropdownMenuItem
            className="dropdown-menu-item-style flex items-center justify-between"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTotal(!showTotal);
            }}
          >
            <Hash className="size-4 text-neutral-500" />
            <span className="flex items-center gap-2">Total</span>
            <Check
              className={cn(
                "ml-auto size-4 shrink-0",
                showTotal ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
