import { ENDPOINTS } from "@/app/config/api";
import { Sponsor, SponsorsResponse } from "@/app/types/rewards/sponsors";

export async function getSponsors(
  perPage?: number,
): Promise<SponsorsResponse | null> {
  const params = new URLSearchParams();
  if (perPage) {
    params.append("per_page", perPage.toString());
  }

  const queryString = params.toString();
  const url = `${ENDPOINTS.localApi.talent.sponsors}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch sponsors");
  }

  return response.json();
}

export async function getSponsor(slug: string): Promise<Sponsor | null> {
  const url = `${ENDPOINTS.localApi.talent.sponsors}/${slug}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch sponsor");
  }

  return response.json();
}
