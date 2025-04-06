"use client";

import Image from "next/image";
import SelectSponsor from "@/app/components/SelectSponsor";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const { isDarkMode } = useTheme();
  
  return (
    <nav className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2 ml-1">
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
          style={{ width: 'auto', height: '15px' }}
        />
        <h1 className="font-semibold text-foreground whitespace-nowrap">Builder Rewards</h1>
      </div>
      <SelectSponsor />
    </nav>
  );
}