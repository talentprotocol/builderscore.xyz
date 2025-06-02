import { ENDPOINTS } from "@/app/config/api";
import { DEFAULT_SEARCH_DOCUMENT } from "@/app/lib/constants";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { fetchSearchAdvanced } from "@/app/services/index/search-advanced";
import { fetchSearchAdvancedMetadataFields } from "@/app/services/index/search-fields";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { SearchDataResponse } from "@/app/types/index/search";
import { useSuspenseQuery } from "@tanstack/react-query";
import axios from "axios";
import { RuleGroupType } from "react-querybuilder";
import { Field } from "react-querybuilder";

const isServer = typeof window === "undefined";

export function useSearchDocuments() {
  return useSuspenseQuery<AdvancedSearchDocument[]>({
    queryKey: ["searchDocuments"],
    queryFn: () =>
      axios
        .get(ENDPOINTS.localApi.talent.searchAdvancedDocuments)
        .then((res) => res.data),
  });
}

export function useSearchFields(
  selectedDocument: string = DEFAULT_SEARCH_DOCUMENT,
) {
  return useSuspenseQuery<Field[]>({
    queryKey: ["searchFields", selectedDocument],
    queryFn: async () => {
      if (isServer) {
        return fetchSearchAdvancedMetadataFields({
          documents: selectedDocument,
        });
      }
      const res = await axios.get(
        `${ENDPOINTS.localApi.talent.searchAdvancedMetadataFields}/${selectedDocument}`,
      );
      return res.data;
    },
  });
}

export function useSearchProfiles(props: {
  selectedDocument?: string;
  query: RuleGroupType;
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
}) {
  const {
    selectedDocument = DEFAULT_SEARCH_DOCUMENT,
    query,
    order = "desc",
    page = 1,
    perPage = 10,
  } = props;

  return useSuspenseQuery({
    queryKey: ["searchProfiles", query, order, page, perPage],
    queryFn: async () => {
      const requestBody: AdvancedSearchRequest = {
        query: {
          customQuery: buildNestedQuery(query),
        },
        sort: {
          score: {
            order,
          },
          id: {
            order,
          },
        },
        page,
        per_page: perPage,
      };

      const queryString = Object.keys(requestBody)
        .map(
          (key) =>
            `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
        )
        .join("&");

      if (isServer) {
        const data = await fetchSearchAdvanced({
          documents: selectedDocument,
          queryString,
        });
        return data as SearchDataResponse;
      } else {
        const res = await axios.get(
          `${ENDPOINTS.localApi.talent.searchAdvanced}/${selectedDocument}?${queryString}`,
        );
        return res.data as SearchDataResponse;
      }
    },
  });
}
