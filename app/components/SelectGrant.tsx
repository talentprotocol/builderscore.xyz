"use client";

import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { useTheme } from "@/app/context/ThemeContext";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useEffect } from "react";

export default function SelectGrant() {
  const { grants, selectedGrant, setSelectedGrant, isLoading } = useGrant();
  const { selectedSponsorSlug } = useSponsor();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!selectedGrant && !isLoading && grants.length > 0) {
      const intermediateGrants = grants.filter(grant => grant.track_type === "intermediate");
      
      if (intermediateGrants.length > 0) {
        const sortedGrants = [...intermediateGrants].sort((a, b) => 
          new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
        );
        
        setSelectedGrant(sortedGrants[0]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, grants.length]);

  if (isLoading) {
    return (
      <Select disabled value={selectedGrant?.id?.toString() || "all"}>
        <SelectTrigger className={`
          text-xs h-6 w-56 p-2 cursor-not-allowed
          ${isDarkMode 
            ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white" 
            : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
          }
        `}>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  const formatGrantOption = (grant: { sponsor: { name: string }, start_date: string, end_date: string }) => {
    const startDate = format(new Date(grant.start_date), "MMM d");
    const endDate = format(new Date(grant.end_date), "MMM d, yyyy");
    if (selectedSponsorSlug === "global") {
      return (
        <div className="flex items-start gap-2">
          <span className={isDarkMode ? "text-neutral-500" : "text-neutral-600"}>{grant.sponsor.name}</span>
          <span>{startDate} - {endDate}</span>
        </div>
      );
    }
    return `${startDate} - ${endDate}`;
  };

  return (
    <Select
      value={selectedGrant?.id?.toString() || "all"}
      onValueChange={(value) => {
        if (value === "all") {
          setSelectedGrant(null);
          return;
        }
        const grant = grants.find((g) => g.id === Number(value)) || null;
        setSelectedGrant(grant);
      }}
    >
      <SelectTrigger
        className={`
        text-xs h-6 w-56 p-2 cursor-pointer
        ${
          isDarkMode
            ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
            : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
        }
      `}
      >
        <SelectValue placeholder="Select Grant" />
      </SelectTrigger>
      <SelectContent
        className={`
        text-xs border-none
        ${
          isDarkMode ? "bg-neutral-800 text-white" : "bg-white text-neutral-800"
        }
      `}
      >
        <SelectItem
          className={`
            text-xs cursor-pointer 
            ${
              isDarkMode
                ? "bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700"
                : "bg-white hover:bg-neutral-100 focus:bg-neutral-100"
            }
          `}
          value="all"
        >
          All Time
        </SelectItem>
        {grants.map((grant) => (
          <SelectItem
            key={grant.id}
            className={`
              text-xs cursor-pointer 
              ${
                isDarkMode
                  ? "bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700"
                  : "bg-white hover:bg-neutral-100 focus:bg-neutral-100"
              }
            `}
            value={grant.id.toString()}
          >
            {formatGrantOption(grant)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 