import { ENDPOINTS } from "@/app/config/api";
import {
  fetchTalentAccounts,
  fetchTalentBuilderScore,
  fetchTalentContributedProjects,
  fetchTalentCredentials,
  fetchTalentCredentialsDatapoints,
  fetchTalentProfile,
  fetchTalentProfileByFid,
  fetchTalentSocials,
} from "@/app/services/talent";
import {
  TalentAccountsResponse,
  TalentContributedProjectsResponse,
  TalentCredentialsResponse,
  TalentDataPointsResponse,
  TalentProfileResponse,
  TalentScoreResponse,
  TalentSocialsResponse,
} from "@/app/types/talent";
import { isServer, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useUser } from "../context/UserContext";

export function useTalentProfile(uuid: string) {
  return useQuery<TalentProfileResponse>({
    queryKey: ["talentProfile", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentProfile(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.profile}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}

export function useCurrentTalentProfile() {
  const { frameContext, isSDKLoaded } = useUser();

  return useQuery<TalentProfileResponse>({
    queryKey: ["talentProfile", frameContext?.user?.fid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentProfileByFid(frameContext!.user.fid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.profileByFid}?fid=${frameContext!.user.fid}`,
        );
        return response.data;
      }
    },
    enabled: !!(frameContext?.user?.fid && isSDKLoaded),
  });
}

export function useTalentCredentials(uuid: string) {
  return useQuery<TalentCredentialsResponse>({
    queryKey: ["talentCredentials", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentCredentials(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.credentials}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentCredentialDatapoints(uuid: string, slug: string) {
  return useQuery<TalentDataPointsResponse>({
    queryKey: ["talentCredentialDatapoints", uuid, slug],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentCredentialsDatapoints(uuid, slug);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.credentialsDatapoints}?uuid=${uuid}&slug=${slug}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentContributedProjects(uuid: string) {
  return useQuery<TalentContributedProjectsResponse>({
    queryKey: ["talentContributedProjects", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentContributedProjects(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.contributedProjects}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentSocials(uuid: string) {
  return useQuery<TalentSocialsResponse>({
    queryKey: ["talentSocials", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentSocials(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.socials}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentAccounts(uuid: string) {
  return useQuery<TalentAccountsResponse>({
    queryKey: ["talentAccounts", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentAccounts(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.accounts}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}

export function useTalentBuilderScore(uuid: string) {
  return useQuery<TalentScoreResponse>({
    queryKey: ["talentBuilderScore", uuid],
    queryFn: async () => {
      if (isServer) {
        const response = await fetchTalentBuilderScore(uuid);
        return response;
      } else {
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.builderScore}?uuid=${uuid}`,
        );
        return response.data;
      }
    },
  });
}
