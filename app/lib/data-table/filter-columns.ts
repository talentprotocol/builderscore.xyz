import type {
  ExtendedColumnFilter,
  // JoinOperator,
} from "@/app/types/data-table";
import { CredentialType, SearchQuery } from "@/app/types/index/search";

export function filterColumns<T extends Record<string, unknown>>({
  filters,
  // joinOperator,
}: {
  filters: ExtendedColumnFilter<T>[];
  // joinOperator: JoinOperator;
}): SearchQuery {
  const query: Partial<SearchQuery> = {};

  filters.forEach((filter) => {
    const fieldId = filter.id as string;

    switch (fieldId) {
      case "humanCheckmark":
        if (typeof filter.value === "string") {
          query.humanCheckmark = filter.value === "true";
        } else if (typeof filter.value === "boolean" || filter.value === null) {
          query.humanCheckmark = filter.value;
        }
        break;

      case "score":
        if (
          filter.operator === "isBetween" &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          const min = filter.value[0] ? Number(filter.value[0]) : 0;
          const max = filter.value[1] ? Number(filter.value[1]) : 100;
          query.score = { min, max };
        } else if (filter.operator === "gte") {
          query.score = {
            min: Number(filter.value),
            max: 100,
          };
        } else if (filter.operator === "lte") {
          query.score = {
            min: 0,
            max: Number(filter.value),
          };
        } else if (filter.operator === "eq") {
          query.score = {
            min: Number(filter.value),
            max: Number(filter.value),
          };
        }
        break;

      case "location":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.location = filter.value;
        }
        break;

      case "tags":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.tags = [filter.value];
        } else if (Array.isArray(filter.value)) {
          const tagValues = filter.value.filter(
            (tag): tag is string => typeof tag === "string",
          );
          if (tagValues.length > 0) {
            query.tags = tagValues;
          }
        }
        break;

      case "walletAddresses":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.walletAddresses = [filter.value];
        } else if (Array.isArray(filter.value)) {
          const addresses = filter.value.filter(
            (addr): addr is string => typeof addr === "string",
          );
          if (addresses.length > 0) {
            query.walletAddresses = addresses;
          }
        }
        break;

      case "identity":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.identity = filter.value;
          if (filter.operator === "eq") {
            query.exactMatch = true;
          }
        }
        break;

      case "exactMatch":
        if (typeof filter.value === "string") {
          query.exactMatch = filter.value === "true";
        } else if (typeof filter.value === "boolean") {
          query.exactMatch = filter.value;
        }
        break;

      case "profileIds":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.profileIds = [filter.value];
        } else if (Array.isArray(filter.value)) {
          const ids = filter.value.filter(
            (id): id is string => typeof id === "string",
          );
          if (ids.length > 0) {
            query.profileIds = ids;
          }
        }
        break;

      case "mainRole":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.mainRole = [filter.value];
        } else if (Array.isArray(filter.value)) {
          const roles = filter.value.filter(
            (role): role is string => typeof role === "string",
          );
          if (roles.length > 0) {
            query.mainRole = roles;
          }
        }
        break;

      case "openTo":
        if (filter.variant === "text" && typeof filter.value === "string") {
          query.openTo = [filter.value];
        } else if (Array.isArray(filter.value)) {
          const openToValues = filter.value.filter(
            (val): val is string => typeof val === "string",
          );
          if (openToValues.length > 0) {
            query.openTo = openToValues;
          }
        }
        break;

      case "credentials":
        if (Array.isArray(filter.value)) {
          const validCredentials: CredentialType[] = [];

          for (const credential of filter.value) {
            if (
              typeof credential === "object" &&
              credential !== null &&
              typeof (credential as CredentialType).name === "string" &&
              typeof (credential as CredentialType).dataIssuer === "string"
            ) {
              validCredentials.push(credential as CredentialType);
            }
          }

          if (validCredentials.length > 0) {
            query.credentials = validCredentials;
          }
        }
        break;
    }
  });

  return query as SearchQuery;
}

export function getColumn<T extends Record<string, unknown>>(
  _table: T,
  columnKey: keyof T,
): string {
  return columnKey as string;
}
