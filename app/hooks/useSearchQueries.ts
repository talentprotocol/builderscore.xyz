import { DEFAULT_SEARCH_DOCUMENT } from "@/app/lib/constants";
import { buildNestedQuery } from "@/app/lib/react-querybuilder-utils";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import { SearchDataResponse } from "@/app/types/index/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RuleGroupType } from "react-querybuilder";
import { Field } from "react-querybuilder";

export function useSearchDocuments() {
  return useQuery<AdvancedSearchDocument[]>({
    queryKey: ["searchDocuments"],
    queryFn: () =>
      axios.get("/api/search/advanced/documents").then((res) => res.data),
  });
}

export function useSearchFields(
  selectedDocument: string = DEFAULT_SEARCH_DOCUMENT,
) {
  return useQuery<Field[]>({
    enabled: !!selectedDocument,
    queryKey: ["searchFields", selectedDocument],
    queryFn: () =>
      axios
        .get(`/api/search/advanced/metadata/fields/${selectedDocument}`)
        .then((res) => res.data),
  });
}

export function useSearchProfiles(props: {
  selectedDocument?: string;
  query: RuleGroupType;
  order?: "asc" | "desc";
  page?: number;
  perPage?: number;
  fields: Field[] | undefined;
}) {
  const {
    selectedDocument = DEFAULT_SEARCH_DOCUMENT,
    query,
    order = "desc",
    page = 1,
    perPage = 10,
    fields,
  } = props;

  return useQuery({
    enabled: !!selectedDocument && !!fields,
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

      const res = await axios.get(
        `/api/search/advanced/${selectedDocument}?${queryString}`,
      );

      return res.data as SearchDataResponse;
    },
    placeholderData: keepPreviousData,
  });
}
