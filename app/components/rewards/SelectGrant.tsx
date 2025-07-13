"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useGrants } from "@/app/hooks/useRewards";
import { ALL_TIME_GRANT } from "@/app/lib/constants";
import { formatDate } from "@/app/lib/utils";
import { useEffect } from "react";

export default function SelectGrant() {
  const { selectedGrant, setSelectedGrant, isAllTimeSelected } = useGrant();
  const { selectedSponsor } = useSponsor();

  const { data: grantsData } = useGrants();

  useEffect(() => {
    if (grantsData) {
      setSelectedGrant(grantsData.grants[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantsData]);

  const formatGrantOption = (grant: {
    sponsor: { name: string };
    start_date: string;
    end_date: string;
  }) => {
    const startDate = formatDate(grant.start_date, {
      month: "long",
      day: "numeric",
    });
    const endDate = formatDate(grant.end_date, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    if (selectedSponsor?.slug === "global") {
      return (
        <div className="flex items-start gap-2">
          <span className="secondary-text-style">{grant.sponsor.name}</span>
          <span>
            {startDate} - {endDate}
          </span>
        </div>
      );
    }
    return `${startDate} - ${endDate}`;
  };

  return (
    <Select
      value={
        isAllTimeSelected() ? "all_time" : selectedGrant?.id?.toString() || ""
      }
      onValueChange={(value) => {
        if (value === "all_time") {
          setSelectedGrant(ALL_TIME_GRANT);
          return;
        }
        const grant =
          grantsData?.grants.find((g) => g.id.toString() === value) || null;
        setSelectedGrant(grant);
      }}
    >
      <SelectTrigger className="button-style h-6 w-56 cursor-pointer p-2 text-xs">
        <SelectValue placeholder="Select Grant" />
      </SelectTrigger>
      <SelectContent className="dropdown-menu-style">
        <SelectItem className="dropdown-menu-item-style" value="all_time">
          All Time
        </SelectItem>
        {grantsData ? (
          grantsData.grants.map((grant) => (
            <SelectItem
              key={grant.id}
              className="dropdown-menu-item-style"
              value={grant.id.toString()}
            >
              {formatGrantOption(grant)}
            </SelectItem>
          ))
        ) : (
          <Select
            disabled
            value={
              isAllTimeSelected()
                ? "all_time"
                : selectedGrant?.id?.toString() || ""
            }
          >
            <SelectTrigger className="button-style h-6 w-56 cursor-not-allowed p-2 text-xs">
              <SelectValue placeholder="Loading..." />
            </SelectTrigger>
          </Select>
        )}
      </SelectContent>
    </Select>
  );
}
