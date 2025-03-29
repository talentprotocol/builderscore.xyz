"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { useSponsor } from "@/app/context/SponsorContext";
import { Sponsor } from "../types/sponsors";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SelectSponsor() {
  const { selectedSponsorSlug, setSelectedSponsorSlug, sponsors, isLoading } = useSponsor();
  const params = useParams();
  const router = useRouter();

  const sponsorsList = [
    // {
    //   id: 0,
    //   name: "Global",
    //   slug: "global",
    // },
    ...sponsors,
  ];

  const DEFAULT_SPONSOR_SLUG = "base";

  useEffect(() => {
    const urlSponsor = params.sponsor as string;
    if (urlSponsor) {
      setSelectedSponsorSlug(urlSponsor);
    } else {
      setSelectedSponsorSlug(DEFAULT_SPONSOR_SLUG);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.sponsor]);

  const handleSponsorChange = (newSponsor: string) => {
    setSelectedSponsorSlug(newSponsor);
    router.push(`/${newSponsor}`);
  };
  
  if (isLoading) {
    return (
      <Select disabled value={selectedSponsorSlug}>
        <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-36 p-2 cursor-not-allowed">
          <SelectValue className="text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={selectedSponsorSlug}
      onValueChange={handleSponsorChange}
    >
      <SelectTrigger className="bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-36 p-2 cursor-pointer">
        <SelectValue className="text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent className="text-white border-none bg-neutral-800 text-xs">
        {sponsorsList.map((sponsor: Sponsor) => (
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
