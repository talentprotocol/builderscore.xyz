import { Sponsor, SponsorsResponse } from "@/app/types/sponsors";

export async function getSponsors(perPage?: number): Promise<SponsorsResponse> {
  const params = new URLSearchParams();
  if (perPage) {
    params.append('per_page', perPage.toString());
  }

  const queryString = params.toString();
  const url = `/api/sponsors${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch sponsors');
  }

  return response.json();
}

export async function getSponsor(slug: string): Promise<Sponsor> {
  const url = `/api/sponsors/${slug}`;

  const response = await fetch(url, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch sponsor');
  }

  return response.json();
}