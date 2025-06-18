import { ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import { TalentProfileApi, TalentProfileResponse } from "@/app/types/talent";
import axios, { AxiosError } from "axios";

export const fetchUserByFid = unstable_cache(
  async (fid: number): Promise<TalentProfileResponse> => {
    const url = `${ENDPOINTS.localApi.talent.profile}?fid=${fid}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.TALENT_PROFILE],
  { revalidate: CACHE_60_MINUTES },
);

export interface ProfileLookupResponse {
  profile:
    | (TalentProfileApi & {
        ens?: string;
        onchain_since?: string;
      })
    | null;
}

export const fetchProfileById = unstable_cache(
  async (
    id: string,
    accountSource: "farcaster" | "github" | "wallet" = "wallet",
  ): Promise<ProfileLookupResponse> => {
    const url = `${ENDPOINTS.localApi.talent.lookup}?id=${encodeURIComponent(id)}&account_source=${accountSource}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<Error>;
      throw new Error(`HTTP error! status: ${error.response?.status}`);
    }
  },
  [CACHE_TAGS.TALENT_LOOKUP],
  { revalidate: CACHE_60_MINUTES },
);

export async function fetchProfilesByIds(
  ids: string[],
  accountSource: "farcaster" | "github" | "wallet" = "wallet",
): Promise<ProfileLookupResponse[]> {
  const promises = ids.map((id) => fetchProfileById(id, accountSource));
  return Promise.all(promises);
}
