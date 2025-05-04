import { SPONSORS } from "@/app/lib/constants";

export function getSponsorThemeClassName(sponsor: string) {
  return SPONSORS[sponsor as keyof typeof SPONSORS].themeClassName;
}

export function getSponsorTicker(sponsor: string) {
  return SPONSORS[sponsor as keyof typeof SPONSORS].ticker;
}
