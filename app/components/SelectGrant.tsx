"use client";

import { useGrant } from "@/app/context/GrantContext";
import { useSponsor } from "@/app/context/SponsorContext";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useEffect } from "react";

export default function SelectGrant() {
  const { grants, selectedGrant, setSelectedGrant, isLoading } = useGrant();
  const { selectedSponsorSlug } = useSponsor();

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
        <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-56 p-2 cursor-not-allowed">
          <SelectValue className="text-white" placeholder="Loading..." />
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
          <span className="text-neutral-500">{grant.sponsor.name}</span>
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
        const grant = grants.find(g => g.id === Number(value)) || null;
        setSelectedGrant(grant);
      }}
    >
      <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-56 p-2 cursor-pointer">
        <SelectValue className="text-white" placeholder="Select Grant" />
      </SelectTrigger>
      <SelectContent className="text-white border-none bg-neutral-800 text-xs">
        <SelectItem
          className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
          value="all"
        >
          All Time
        </SelectItem>
        {grants.map((grant) => (
          <SelectItem
            key={grant.id}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
            value={grant.id.toString()}
          >
            {formatGrantOption(grant)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 