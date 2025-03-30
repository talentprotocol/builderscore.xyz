"use client";

import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

export function Footer() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="py-6">
      <p className={`text-center ${isDarkMode ? "text-neutral-500" : "text-neutral-600"} text-sm`}>
        <Link
          className="underline hover:text-primary"
          href="https://talentprotocol.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Talent Protocol
        </Link>
        , {new Date().getFullYear()}
      </p>
    </div>
  );
}
