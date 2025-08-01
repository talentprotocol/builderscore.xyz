"use client";

import HowToDrawer from "@/app/components/rewards/HowToDrawer";
import SelectSponsor from "@/app/components/rewards/SelectSponsor";
import { Button } from "@/app/components/ui/button";
import { SPONSORS } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({
  sponsor,
  title,
  menu,
}: {
  sponsor?: string;
  title: string;
  menu?: boolean;
}) {
  const pathname = usePathname();
  const [openHowToDrawer, setOpenHowToDrawer] = useState(false);

  const currentSponsor = SPONSORS[sponsor as keyof typeof SPONSORS]
    ? SPONSORS[sponsor as keyof typeof SPONSORS]
    : SPONSORS["talent-protocol"];

  const Logo = currentSponsor?.logo;

  let homeUrl;

  switch (true) {
    case Boolean(sponsor):
      homeUrl = `/${sponsor}`;
      break;
    case pathname === "/dashboard/base":
      homeUrl = "/dashboard/base";
      break;
    default:
      homeUrl = "/";
  }

  return (
    <nav className="mb-1 flex-col items-center sm:mb-2 sm:flex sm:flex-row sm:justify-between">
      <div className="mb-2 sm:mb-0">
        <Link href={homeUrl} className="flex items-center gap-2">
          <Logo
            className="ml-0.5 block h-3 w-auto"
            color={currentSponsor?.color}
          />
          <h1
            className={`text-foreground font-medium whitespace-nowrap ${menu ? "text-xs" : "text-sm"}`}
          >
            {title}
          </h1>
        </Link>

        {menu && (
          <ul className="flex items-center gap-4">
            <li>
              <Link
                href="/dashboard/base"
                className={cn(
                  "text-xs text-neutral-500",
                  pathname === "/dashboard/base" && "text-white",
                )}
              >
                Base Index
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={cn(
                  "text-xs text-neutral-500",
                  pathname === "/" && "text-white",
                )}
              >
                Builder Rewards
              </Link>
            </li>
          </ul>
        )}
      </div>

      {sponsor && (
        <div className="flex items-center gap-2">
          <SelectSponsor />
          <Button
            className="button-style h-6 w-1/2 cursor-pointer p-2 text-xs sm:w-36"
            onClick={() => setOpenHowToDrawer(true)}
          >
            Start Earning
          </Button>
          <HowToDrawer
            open={openHowToDrawer}
            onOpenChange={setOpenHowToDrawer}
          />
        </div>
      )}
    </nav>
  );
}
