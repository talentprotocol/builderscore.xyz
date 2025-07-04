"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSponsor } from "@/app/context/SponsorContext";
import { useSponsors } from "@/app/hooks/useRewards";
import { ALLOWED_SPONSORS } from "@/app/lib/constants";
import { Sponsor } from "@/app/types/rewards/sponsors";

export default function SelectSponsor() {
  const { selectedSponsor, setSelectedSponsorFromSlug } = useSponsor();

  const { data: sponsorsData } = useSponsors();

  const sponsorsList = sponsorsData?.sponsors?.filter((sponsor) =>
    ALLOWED_SPONSORS.includes(sponsor.slug),
  );

  const handleSponsorChange = (newSponsor: string) => {
    setSelectedSponsorFromSlug(newSponsor);
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/");
    pathSegments[1] = newSponsor;
    window.history.pushState(null, "", pathSegments.join("/"));
  };

  return (
    <Select value={selectedSponsor?.slug} onValueChange={handleSponsorChange}>
      <SelectTrigger className="button-style h-6 w-36 cursor-pointer p-2 text-xs">
        <SelectValue className="dark:text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent className="dropdown-menu-style">
        {sponsorsList ? (
          sponsorsList.map((sponsor: Sponsor) => (
            <SelectItem
              key={sponsor.id}
              className="dropdown-menu-item-style"
              value={sponsor.slug}
            >
              {sponsor.name}
            </SelectItem>
          ))
        ) : (
          <Select disabled>
            <SelectTrigger className="button-style h-6 w-36 cursor-not-allowed p-2 text-xs">
              <SelectValue
                className="dark:text-white"
                placeholder="Loading..."
              />
            </SelectTrigger>
          </Select>
        )}
      </SelectContent>
    </Select>
  );
}
