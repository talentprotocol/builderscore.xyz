import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<
  string,
  number
> = {
  $TALENT: 0,
  ETH: 3,
  CELO: 0,
};

export const TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<
  string,
  number
> = {
  $TALENT: 0,
  ETH: 0,
  CELO: 0,
};

export function formatNumber(x: number, decimals: number = 0): string {
  let navigatorLanguage = "en-US";

  if (typeof window !== "undefined") {
    navigatorLanguage = navigator.language;
  }

  const formattedAmount = new Intl.NumberFormat(navigatorLanguage, {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(x);

  return formattedAmount;
}

export function formatDate(date: string): string {
  let dateObj;

  try {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      if (date.includes("UTC")) {
        const cleanDate = date.replace("UTC", "").trim();
        dateObj = new Date(cleanDate);
      }
    }
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date Format";
    }
  } catch {
    return "Invalid Date Format";
  }

  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  let formattedStartDate = "";
  const formattedEndDate = new Date(endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (startYear !== endYear) {
    formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } else {
    formattedStartDate = new Date(startDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  return `${formattedStartDate} - ${formattedEndDate}`;
}

export function getTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Ended";
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} Month${diffMonths > 1 ? "s" : ""} Left`;
  } else if (diffDays > 0) {
    return `${diffDays} Day${diffDays > 1 ? "s" : ""} Left`;
  } else {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} Hour${diffHours > 1 ? "s" : ""} Left`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} Minute${diffMinutes > 1 ? "s" : ""} Left`;
    }
  }
}
