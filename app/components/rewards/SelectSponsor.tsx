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
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SelectSponsor() {
  const { selectedSponsorSlug, setSelectedSponsorSlug, sponsors, isLoading } =
    useSponsor();
  const { isDarkMode } = useTheme();
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
    <Select value={selectedSponsorSlug} onValueChange={handleSponsorChange}>
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
