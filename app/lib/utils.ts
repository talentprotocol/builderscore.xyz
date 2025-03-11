import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Get the number of decimals to use from the API
export function formatNumber(x: number, decimals: number = 0): string {
  return x.toFixed(decimals).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}