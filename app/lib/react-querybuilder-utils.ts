import { formatQuery, RuleGroupTypeAny } from "react-querybuilder";

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

  const groups: { [key: string]: Record<string, unknown>[] } = {};

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const currentParts = currentKey.split(".");

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
    const prefix = longestPrefix || currentParts[0];
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

type ESQueryClause = {
  [key: string]: unknown;
};

const mergeCombinatorObjects = (
  combinator: string,
  query: Record<string, ESQueryClause>[],
) => {
  console.debug("mergeCombinatorObjects: combinator", combinator);
  for (let i = 0; i < query.length; i++) {
    const queryItem = query[i];
    console.debug("queryItem", queryItem);
  }

  const nonBoolItems = query.filter((item) => {
    const operator = Object.keys(item)[0];
    console.debug("operator", operator);
    if (operator !== "bool") {
      return item;
    }
  });
  console.debug("nonBoolItems", nonBoolItems);

  const boolItems = query.filter((item) => {
    const operator = Object.keys(item)[0];
    console.debug("operator", operator);
    if (operator === "bool") {
      return item;
    }
  });
  console.debug("boolItems", boolItems);
  const boolItemsHandled = boolItems.map((boolItem) => {
    return handleNestedDocuments(boolItem);
  });
  console.debug("boolItems after handleNestedDocuments", boolItemsHandled);

  const nestedFieldItems = nonBoolItems.filter((item) => {
    const operator = Object.keys(item)[0];
    const fieldName = Object.keys(item[operator])[0];
    console.debug("fieldName", fieldName);
    if (fieldName.includes(".")) {
      return item;
    }
  });
  console.debug("nestedFieldItems", nestedFieldItems);

  const nonNestedFieldItems = nonBoolItems.filter((item) => {
    const operator = Object.keys(item)[0];
    const fieldName = Object.keys(item[operator])[0];
    console.debug("fieldName", fieldName);
    if (!fieldName.includes(".")) {
      return item;
    }
  });
  console.debug("nonNestedFieldItems", nonNestedFieldItems);

  const groupedByLongestPrefix = groupByLongestPrefix(nestedFieldItems);
  console.debug("groupedByLongestPrefix", groupedByLongestPrefix);
  const mergedResult: Record<string, ESQueryClause> = {};
  for (const group in groupedByLongestPrefix) {
    console.debug("group name:", group);
    const groupItems = groupedByLongestPrefix[group];
    console.debug("group items:", groupItems);
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
  console.debug("mergedResult", mergedResult);

  const mergeResultValues = Object.keys(mergedResult).map((key) => {
    return mergedResult[key];
  });

  console.debug("mergeResultValues", mergeResultValues);

  // Ensure mergeResultValues is an array of Record<string, ESQueryClause>
  const mergeCombinatorObjectsResult = nonNestedFieldItems
    .concat(mergeResultValues as Record<string, ESQueryClause>[])
    .concat(boolItemsHandled);
  console.debug("mergeCombinatorObjectsResult", mergeCombinatorObjectsResult);
  return mergeCombinatorObjectsResult;
};

const handleNestedDocuments = (
  formattedQuery: Record<string, ESQueryClause>,
) => {
  console.debug("formattedQuery", formattedQuery);
  if (formattedQuery && typeof formattedQuery === "object") {
    for (const key in formattedQuery) {
      console.debug("key", key);
      if (formattedQuery.hasOwnProperty(key)) {
        if (key === "bool") {
          console.debug("found bool", formattedQuery[key]);
          const combinator = Object.keys(formattedQuery[key])[0];
          console.debug("combinator", combinator);
          const mergeResult = mergeCombinatorObjects(
            combinator,
            formattedQuery[key][combinator] as Record<string, ESQueryClause>[],
          );
          formattedQuery[key][combinator] = mergeResult;
        }
      }
    }
  }
  return formattedQuery;
};

export {
  buildQueryString,
  groupByLongestPrefix,
  handleNestedDocuments,
  mergeCombinatorObjects,
};
