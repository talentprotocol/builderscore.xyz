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
import { isServer, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
    enabled: !!uuid,
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
    enabled: !!uuid,
  });
}

export function useTalentContributedProjects(uuid: string) {
  return useInfiniteQuery<TalentContributedProjectsResponse>({
    queryKey: ["talentContributedProjects", uuid],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const paginationParams = {
        per_page: 25,
        page: pageParam as number,
      };

      if (isServer) {
        const response = await fetchTalentContributedProjects(
          uuid,
          paginationParams,
        );
        return response;
      } else {
        const queryParams = new URLSearchParams({
          uuid,
          ...Object.fromEntries(
            Object.entries(paginationParams).map(([key, value]) => [
              key,
              value.toString(),
            ]),
          ),
        });
        const response = await axios.get(
          `${ENDPOINTS.localApi.talent.contributedProjects}?${queryParams.toString()}`,
        );
        return response.data;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { current_page, last_page } = lastPage.pagination;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: !!uuid,
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
    enabled: !!uuid,
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
    enabled: !!uuid,
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
    enabled: !!uuid,
  });
}
