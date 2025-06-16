"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSponsor } from "@/app/context/SponsorContext";
import { useHistoryListener } from "@/app/hooks/useHistoryListener";
import { useSponsors } from "@/app/hooks/useLoadRewards";
import { ALLOWED_SPONSORS } from "@/app/lib/constants";
import { Sponsor } from "@/app/types/rewards/sponsors";

export default function SelectSponsor() {
  const { selectedSponsor, setSelectedSponsorFromSlug } = useSponsor();

  const { data: sponsorsData, isLoading: loadingSponsors } = useSponsors();

  const sponsorsList = [
    // {
    //   id: 0,
    //   name: "Global",
    //   slug: "global",
    // },
    ...(sponsorsData?.sponsors?.filter((sponsor) =>
      ALLOWED_SPONSORS.includes(sponsor.slug),
    ) || []),
  ];

  const handleSponsorChange = (newSponsor: string) => {
    setSelectedSponsorFromSlug(newSponsor);
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split("/");
    pathSegments[1] = newSponsor;
    window.history.pushState(null, "", pathSegments.join("/"));
  };

  useHistoryListener((url) => {
    const pathname = url.startsWith("http") ? new URL(url).pathname : url;
    const pathSegments = pathname.split("/");
    const sponsorSlug = pathSegments[1] || "";

    if (sponsorSlug && sponsorSlug !== selectedSponsor?.slug) {
      setSelectedSponsorFromSlug(sponsorSlug);
    }
  });

  if (loadingSponsors) {
    return (
      <Select disabled>
        <SelectTrigger className="button-style h-6 w-36 cursor-not-allowed p-2 text-xs">
          <SelectValue className="dark:text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedSponsor?.slug} onValueChange={handleSponsorChange}>
      <SelectTrigger className="button-style h-6 w-36 cursor-pointer p-2 text-xs">
        <SelectValue className="dark:text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent className="dropdown-menu-style">
        {sponsorsList.map((sponsor: Sponsor) => (
          <SelectItem
            key={sponsor.id}
            className="dropdown-menu-item-style"
            value={sponsor.slug}
          >
            {sponsor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
