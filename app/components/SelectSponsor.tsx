"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSponsor } from "@/app/context/SponsorContext";

export default function SelectSponsor() {
  const { selectedSponsorSlug, setSelectedSponsorSlug, sponsors, isLoading } = useSponsor();

  if (isLoading) {
    return (
      <Select disabled value={selectedSponsorSlug}>
        <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-32 p-2 cursor-not-allowed">
          <SelectValue className="text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={selectedSponsorSlug}
      onValueChange={setSelectedSponsorSlug}
    >
      <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-32 p-2 cursor-pointer">
        <SelectValue className="text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent className="text-white border-none bg-neutral-800 text-xs">
        <SelectItem
          className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
          value="global"
        >
          Global
        </SelectItem>
        {sponsors.map((sponsor) => (
          <SelectItem
            key={sponsor.id}
            className="text-xs bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
            value={sponsor.slug}
          >
            {sponsor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
