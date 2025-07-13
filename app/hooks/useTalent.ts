import { ENDPOINTS } from "@/app/config/api";
import {
  fetchTalentAccounts,
  fetchTalentContributedProjects,
  fetchTalentCredentials,
  fetchTalentSocials,
} from "@/app/services/talent";
import {
  TalentAccountsResponse,
  TalentContributedProjectsResponse,
  TalentCredentialsResponse,
  TalentSocialsResponse,
} from "@/app/types/talent";
import { isServer, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useTalentCredentials(fid: string) {
  return useQuery<TalentCredentialsResponse>({
    queryKey: ["talentCredentials", fid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentCredentials(fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.credentials}?fid=${fid}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentContributedProjects(fid: string) {
  return useQuery<TalentContributedProjectsResponse>({
    queryKey: ["talentContributedProjects", fid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentContributedProjects(fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.contributedProjects}?fid=${fid}`,
        );
        return response.data;
      }
    },
  });
}

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

export function useTalentAccounts(fid: string) {
  return useQuery<TalentAccountsResponse>({
    queryKey: ["talentAccounts", fid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentAccounts(fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.accounts}?fid=${fid}`,
        );
        return response.data;
      }
    },
  });
}
