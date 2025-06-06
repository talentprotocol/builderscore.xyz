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
import { ALLOWED_SPONSORS } from "@/app/lib/constants";
import { Sponsor } from "@/app/types/sponsors";

export default function SelectSponsor() {
  const {
    sponsors,
    loadingSponsors,
    selectedSponsor,
    setSelectedSponsorFromSlug,
  } = useSponsor();

  const sponsorsList = [
    // {
    //   id: 0,
    //   name: "Global",
    //   slug: "global",
    // },
    ...sponsors.filter((sponsor) => ALLOWED_SPONSORS.includes(sponsor.slug)),
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
        <SelectTrigger className="h-6 cursor-not-allowed border-neutral-300 bg-white p-2 text-xs text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
          <SelectValue className="dark:text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedSponsor?.slug} onValueChange={handleSponsorChange}>
      <SelectTrigger className="h-6 cursor-pointer border-neutral-300 bg-white p-2 text-xs text-neutral-800 hover:bg-neutral-100 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800">
        <SelectValue className="dark:text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent className="border-none bg-white text-xs text-neutral-800 dark:bg-neutral-800 dark:text-white">
        {sponsorsList.map((sponsor: Sponsor) => (
          <SelectItem
            key={sponsor.id}
            className="cursor-pointer bg-white text-xs hover:bg-neutral-100 focus:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            value={sponsor.slug}
          >
            {sponsor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
