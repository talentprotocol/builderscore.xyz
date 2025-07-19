import { API_BASE_URL, DEFAULT_HEADERS, ENDPOINTS } from "@/app/config/api";
import { CACHE_60_MINUTES, CACHE_TAGS } from "@/app/lib/cache-utils";
import { unstable_cache } from "@/app/lib/unstable-cache";
import {
  TalentAccountsResponse,
  TalentContributedProjectsResponse,
  TalentCredentialsResponse,
  TalentDataPointsResponse,
  TalentProfileResponse,
  TalentProjectsResponse,
  TalentScoreResponse,
  TalentSocialsResponse,
} from "@/app/types/talent";
import axios, { AxiosError } from "axios";

export const fetchTalentProfile = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentProfileResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch (err) {
        const error = err as AxiosError<Error>;

        if (error.response?.status === 404) {
          return null;
        }

        throw new Error(`HTTP error! status: ${error.response?.status}`);
      }
    },
    [CACHE_TAGS.TALENT_PROFILE, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentProfileByFid = (fid: number) =>
  unstable_cache(
    async (): Promise<TalentProfileResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${fid}&account_source=farcaster`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch (err) {
        const error = err as AxiosError<Error>;

        if (error.response?.status === 404) {
          return null;
        }

        throw new Error(`HTTP error! status: ${error.response?.status}`);
      }
    },
    [CACHE_TAGS.TALENT_PROFILE, fid.toString()],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentProfileByFarcasterUsername = (username: string) =>
  unstable_cache(
    async (): Promise<TalentProfileResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.profile}?id=${username}&account_source=farcaster`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch (err) {
        const error = err as AxiosError<Error>;

        if (error.response?.status === 404) {
          return null;
        }

        throw new Error(`HTTP error! status: ${error.response?.status}`);
      }
    },
    [CACHE_TAGS.TALENT_PROFILE, username],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentSocials = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentSocialsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.socials}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_SOCIALS, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentAccounts = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentAccountsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.accounts}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_ACCOUNTS, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentCredentials = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentCredentialsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.credentials}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_CREDENTIALS, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentCredentialsDatapoints = (uuid: string, slug: string) =>
  unstable_cache(
    async (): Promise<TalentDataPointsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.credentialsDatapoints}?id=${uuid}&slugs=${slug}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_CREDENTIALS_DATAPOINTS, uuid, slug],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentBuilderScore = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentScoreResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.builderScore}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_BUILDER_SCORE, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentProjects = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentProjectsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.projects}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_PROJECTS, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();

export const fetchTalentContributedProjects = (uuid: string) =>
  unstable_cache(
    async (): Promise<TalentContributedProjectsResponse | null> => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${ENDPOINTS.talent.contributedProjects}?id=${uuid}`,
          {
            headers: DEFAULT_HEADERS,
          },
        );

        return response.data;
      } catch {
        return null;
      }
    },
    [CACHE_TAGS.TALENT_CONTRIBUTED_PROJECTS, uuid],
    { revalidate: CACHE_60_MINUTES },
  )();
