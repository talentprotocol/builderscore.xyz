"use client";

import SelectSponsor from "@/app/components/rewards/SelectSponsor";
import { useTheme } from "@/app/context/ThemeContext";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ sponsored }: { sponsored?: boolean }) {
  const { isDarkMode } = useTheme();

  return (
    <nav className="mb-3 flex items-center justify-between">
      <Link href="/" className="ml-1 flex items-center gap-2">
        <Image
          src={
            isDarkMode
              ? "/images/talent_protocol_icon_white.svg"
              : "/images/base_logo_blue.svg"
          }
          alt="Talent Protocol"
          fill={false}
          height={15}
          width={15}
          style={{ width: "auto", height: "15px" }}
        />
        <h1 className="text-foreground font-semibold whitespace-nowrap">
          Builder Rewards
        </h1>
      </Link>

      {sponsored && <SelectSponsor />}
    </nav>
  );
}
