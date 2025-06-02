import { ESQuery } from "@/app/types/elasticSearchTypes";
import { RuleGroupTypeAny } from "react-querybuilder";
import { formatQuery } from "react-querybuilder/formatQuery";

const buildQueryString = (query: RuleGroupTypeAny) => {
  return formatQuery(query, {
    format: "elasticsearch",
    parseNumbers: true,
    preserveValueOrder: true,
  });
};

const groupByLongestPrefix = (arr: Record<string, unknown>[]) => {
  // Extract all keys
  // Note that here we have objects like these:
  // { "term": { "scores.scorer": "Builder Score" } }
  // { "range": { "scores.points": { "gte": 0, "lte": 500 } } }
  // So, it is not the first key of the root object, but the first key of the nested object
  // that we need to group by.
  const keys = arr
    .map((obj) => {
      const firstKey = Object.keys(obj)[0];
      const firstValue = obj[firstKey];
      const firstNestedKey =
        firstValue && typeof firstValue === "object"
          ? Object.keys(firstValue)[0]
          : undefined;
      return firstNestedKey;
    })
    .filter((key) => key !== undefined) as string[];

  // Sort the keys to prepare for grouping by common prefix
  keys.sort();

  console.debug("Keys sorted for grouping:", keys);

  const groups: { [key: string]: Record<string, unknown>[] } = {};

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const currentParts = currentKey.split(".").slice(0, -1); // Exclude the last part for grouping

    let longestPrefix = "";
    let maxLength = 0;

    for (let j = 0; j < keys.length; j++) {
      if (i === j) continue;

      const otherKey = keys[j];
      const otherParts = otherKey.split(".");

      const commonParts = [];
      for (
        let k = 0;
        k < Math.min(currentParts.length, otherParts.length);
        k++
      ) {
        if (currentParts[k] === otherParts[k]) {
          commonParts.push(currentParts[k]);
        } else {
          break;
        }
      }

      const commonPrefix = commonParts.join(".");
      if (commonParts.length > 0 && commonPrefix.length > maxLength) {
        longestPrefix = commonPrefix;
        maxLength = commonPrefix.length;
      }
    }

    // Fallback: use top-level prefix if no common one found
    const prefix = longestPrefix || currentParts.join(".");
    if (!groups[prefix]) {
      groups[prefix] = [];
    }

    const obj = arr.find((o) => {
      const firstKey = Object.keys(o)[0];
      const firstValue = o[firstKey];
      return (
        firstValue &&
        typeof firstValue === "object" &&
        Object.keys(firstValue)[0] === currentKey
      );
    });
    if (obj !== undefined) {
      groups[prefix].push(obj);
    }
  }

  return groups;
};

const mergeCombinatorObjects = (combinator: string, query: ESQuery[]) => {
  const nonBoolItems = query.filter((item) => {
    const operator = Object.keys(item)[0];
    if (operator !== "bool") {
      return item;
    }
  });

  const boolItems = query.filter((item) => {
    const operator = Object.keys(item)[0];
    if (operator === "bool") {
      return item;
    }
  });
  const boolItemsHandled = boolItems.map((boolItem) => {
    return handleNestedDocuments(boolItem);
  });

  const nestedFieldItems = nonBoolItems.filter((item) => {
    const operator = Object.keys(item)[0];
    const fieldName = Object.keys(item[operator])[0];
    if (fieldName.includes(".")) {
      return item;
    }
  });

  const nonNestedFieldItems = nonBoolItems.filter((item) => {
    const operator = Object.keys(item)[0];
    const fieldName = Object.keys(item[operator])[0];
    if (!fieldName.includes(".")) {
      return item;
    }
  });

  const groupedByLongestPrefix = groupByLongestPrefix(nestedFieldItems);
  const mergedResult: ESQuery = {};
  console.debug("Grouped by longest prefix:", groupedByLongestPrefix);
  for (const group in groupedByLongestPrefix) {
    const groupItems = groupedByLongestPrefix[group];
    mergedResult[group] = {
      nested: {
        path: group,
        query: {
          bool: {
            [combinator]: groupItems,
          },
        },
      },
    };
    // We need to build an object like this:
    // {
    //   "nested": {
    //     "path": "scores",
    //     "query": {
    //       "bool": {
    //         "must": [
    //           { "term": { "scores.scorer": "Builder Score" } },
    //           { "range": { "scores.points": { "gte": 0, "lte": 500 } } }
    //         ]
    //       }
    //     }
    //   }
    // },
  }

  const mergeResultValues = Object.keys(mergedResult).map((key) => {
    return mergedResult[key];
  });

  // Ensure mergeResultValues is an array of Record<string, ESQueryClause>
  const mergeCombinatorObjectsResult = nonNestedFieldItems
    .concat(mergeResultValues as ESQuery[])
    .concat(boolItemsHandled);
  return mergeCombinatorObjectsResult;
};

const handleNestedDocuments = (formattedQuery: ESQuery) => {
  if (formattedQuery && typeof formattedQuery === "object") {
    for (const key in formattedQuery) {
      if (formattedQuery.hasOwnProperty(key)) {
        if (key === "bool") {
          const combinator = Object.keys(formattedQuery[key])[0];
          const mergeResult = mergeCombinatorObjects(
            combinator,
            formattedQuery[key][combinator] as ESQuery[],
          );
          formattedQuery[key][combinator] = mergeResult;
        }
      }
    }
  }
  return formattedQuery;
};

const buildNestedQuery = (query: RuleGroupTypeAny) => {
  const formattedQuery = buildQueryString(query);
  return handleNestedDocuments(formattedQuery);
};

export {
  buildQueryString,
  groupByLongestPrefix,
  handleNestedDocuments,
  mergeCombinatorObjects,
  buildNestedQuery,
};
