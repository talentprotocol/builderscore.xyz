import { Grant, GrantParams, GrantsResponse } from "@/app/types/grants";

export async function getGrants(
  params?: GrantParams,
): Promise<GrantsResponse | null> {
  const searchParams = new URLSearchParams();

  if (params?.end_date_after) {
    searchParams.append("end_date_after", params.end_date_after);
  }
  if (params?.end_date_before) {
    searchParams.append("end_date_before", params.end_date_before);
  }
  if (params?.sponsor_slug) {
    searchParams.append("sponsor_slug", params.sponsor_slug);
  }
  if (params?.per_page) {
    searchParams.append("per_page", params.per_page.toString());
  }
  if (params?.page) {
    searchParams.append("page", params.page.toString());
  }

  const queryString = searchParams.toString();
  const url = `/api/grants${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch grants");
  }

  return response.json();
}

export async function getGrant(id: number): Promise<Grant | null> {
  const url = `/api/grants/${id}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch grant");
  }

  return response.json();
}
