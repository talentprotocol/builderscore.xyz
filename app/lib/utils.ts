import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const INDIVIDUAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<string, number> = {
  $TALENT: 0,
  ETH: 3,
};

export const TOTAL_REWARD_AMOUNT_DISPLAY_TOKEN_DECIMALS: Record<string, number> = {
  $TALENT: 0,
  ETH: 0,
};

export function formatNumber(x: number, decimals: number = 0): string {
  const formattedAmount = new Intl.NumberFormat(navigator.language, {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(x);

  return formattedAmount;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
    return `${diffMonths} Month${diffMonths > 1 ? 's' : ''} Left`;
  } else if (diffDays > 0) {
    return `${diffDays} Day${diffDays > 1 ? 's' : ''} Left`;
  } else {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} Hour${diffHours > 1 ? 's' : ''} Left`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} Minute${diffMinutes > 1 ? 's' : ''} Left`;
    }
  }
}
