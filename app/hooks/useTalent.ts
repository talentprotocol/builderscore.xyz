import { ENDPOINTS } from "@/app/config/api";
import { fetchTalentSocials } from "@/app/services/talent";
import { TalentSocialsResponse } from "@/app/types/talent";
import { isServer, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTalentSocials(fid: string) {
  return useQuery<TalentSocialsResponse>({
    queryKey: ["talentSocials", fid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentSocials(fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.socials}?fid=${fid}`,
        );
        return response.data;
      }
    },
  });
}
