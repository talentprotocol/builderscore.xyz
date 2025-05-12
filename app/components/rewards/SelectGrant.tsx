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
import { format } from "date-fns";

export default function SelectGrant() {
  const { grants, selectedGrant, setSelectedGrant, loadingGrants } = useGrant();
  const { selectedSponsor } = useSponsor();

  if (loadingGrants) {
    return (
      <Select disabled value={selectedGrant?.id?.toString() || "all"}>
        <SelectTrigger className="button-style h-6 w-56 cursor-not-allowed p-2 text-xs">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  const formatGrantOption = (grant: {
    sponsor: { name: string };
    start_date: string;
    end_date: string;
  }) => {
    const startDate = format(new Date(grant.start_date), "MMM d");
    const endDate = format(new Date(grant.end_date), "MMM d, yyyy");
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
      <SelectTrigger className="button-style h-6 w-56 cursor-pointer p-2 text-xs">
        <SelectValue placeholder="Select Grant" />
      </SelectTrigger>
      <SelectContent className="border-none bg-white text-xs text-neutral-800 dark:bg-neutral-800 dark:text-white">
        <SelectItem
          className="cursor-pointer bg-white text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
          value="all"
        >
          All Time
        </SelectItem>
        {grants.map((grant) => (
          <SelectItem
            key={grant.id}
            className="cursor-pointer bg-white text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            value={grant.id.toString()}
          >
            {formatGrantOption(grant)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
