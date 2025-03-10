"use client";

import { useGrant } from "@/app/context/GrantContext";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

export default function SelectGrant() {
  const { grants, selectedGrant, setSelectedGrant, isLoading } = useGrant();

  if (isLoading) {
    return (
      <Select disabled value={selectedGrant?.id?.toString() || "all"}>
        <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-40 p-2 cursor-not-allowed">
          <SelectValue className="text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

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
      <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-40 p-2 cursor-pointer">
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
            {format(new Date(grant.start_date), "MMM d")} - {format(new Date(grant.end_date), "MMM d, yyyy")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 