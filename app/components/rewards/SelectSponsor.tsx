"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSponsor } from "@/app/context/SponsorContext";
import { useTheme } from "@/app/context/ThemeContext";
import { Sponsor } from "@/app/types/sponsors";
import { useHistoryListener } from "@/app/hooks/useHistoryListener";

export default function SelectSponsor() {
  const {
    sponsors,
    loadingSponsors,
    selectedSponsor,
    setSelectedSponsorFromSlug,
  } = useSponsor();
  const { isDarkMode } = useTheme();

  const sponsorsList = [
    // {
    //   id: 0,
    //   name: "Global",
    //   slug: "global",
    // },
    ...sponsors,
  ];

  const handleSponsorChange = (newSponsor: string) => {
    setSelectedSponsorFromSlug(newSponsor);
    window.history.pushState(null, "", `/${newSponsor}`);
  };

  useHistoryListener((url) => {
    const pathSegments = url.split("/");
    const sponsorSlug = pathSegments[1] || "";

    if (sponsorSlug && sponsorSlug !== selectedSponsor?.slug) {
      setSelectedSponsorFromSlug(sponsorSlug);
    }
  });

  if (loadingSponsors) {
    return (
      <Select disabled>
        <SelectTrigger
          className={`
            bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white text-xs h-6 w-36 p-2 cursor-not-allowed
            ${
              isDarkMode
                ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
                : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
            }
          `}
        >
          <SelectValue className="text-white" placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedSponsor?.slug} onValueChange={handleSponsorChange}>
      <SelectTrigger
        className={`
          text-xs h-6 w-36 p-2 cursor-pointer
          ${
            isDarkMode
              ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-300 text-white"
              : "bg-white hover:bg-neutral-100 border-neutral-300 text-neutral-800"
          }
        `}
      >
        <SelectValue className="text-white" placeholder="Select Sponsor" />
      </SelectTrigger>
      <SelectContent
        className={`
          text-xs border-none
          ${
            isDarkMode
              ? "bg-neutral-800 text-white"
              : "bg-white text-neutral-800"
          }
        `}
      >
        {sponsorsList.map((sponsor: Sponsor) => (
          <SelectItem
            key={sponsor.id}
            className={`
              text-xs cursor-pointer 
              ${
                isDarkMode
                  ? "bg-neutral-800 hover:bg-neutral-700 focus:bg-neutral-700"
                  : "bg-white hover:bg-neutral-100 focus:bg-neutral-100"
              }
            `}
            value={sponsor.slug}
          >
            {sponsor.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
