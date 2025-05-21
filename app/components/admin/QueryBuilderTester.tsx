"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import React from "react";
import { useEffect, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { QueryBuilder, RuleGroupType, formatQuery } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

function groupByLongestPrefix(arr) {
  // Extract all keys
  const keys = arr.map((obj) => Object.keys(obj[Object.keys(obj)[0]])[0]);

  // Sort the keys to prepare for grouping by common prefix
  keys.sort();

  const groups = {};

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    const currentParts = currentKey.split(".");

    let longestPrefix = "";
    let maxLength = 0;

    for (let j = 0; j < keys.length; j++) {
      if (i === j) continue;

      const otherKey = keys[j];
      const otherParts = otherKey.split(".");

      let commonParts = [];
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

    const obj = arr.find(
      (o) => Object.keys(o[Object.keys(o)[0]])[0] === currentKey,
    );
    groups[prefix].push(obj);
  }

  return groups;
}

export default function QueryBuilderTester() {
  const [fields, setFields] = useState([]);
  const [query, setQuery] = useState<RuleGroupType>({
    combinator: "and",
    rules: [],
  });
  const [documents, setDocuments] = useState<AdvancedSearchDocument[]>([]);
  const [documentSelected, setDocumentSelected] = useState("");
  const [queryResults, setQueryResults] = useState([]);

  useEffect(() => {
    if (documentSelected) {
      (async () => {
        const response = await fetch(
          `/api/search/advanced/metadata/fields/${documentSelected}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );
        const metadataForFields = await response.json();
        console.debug("metadataForFields", metadataForFields);
        setFields(metadataForFields);
      })();

      setQuery({
        combinator: "and",
        rules: [],
      });
    }
  }, [documentSelected]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/search/advanced/documents`);
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      }
    })();
  }, []);

  const onChangeDocumentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentSelected(e.target.value);
  };

  const mergeCombinatorObjects = (
    combinator: string,
    query: Record<string, any>,
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

    // TODO: I need to treat the bool items as well
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
    const mergedResult = {};
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

    const mergeCombinatorObjectsResult = nonNestedFieldItems
      .concat(mergeResultValues)
      .concat(boolItemsHandled);
    console.debug("mergeCombinatorObjectsResult", mergeCombinatorObjectsResult);
    return mergeCombinatorObjectsResult;
  };

  const handleNestedDocuments = (formattedQuery: Record<string, any>) => {
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
              formattedQuery[key][combinator],
            );
            formattedQuery[key][combinator] = mergeResult;
          }
        }
      }
    }
    return formattedQuery;
  };

  const buildQueryString = () => {
    return formatQuery(query, {
      format: "elasticsearch",
      parseNumbers: true,
      preserveValueOrder: true,
    });
  };

  const onClickExecuteQuery = () => {
    const queryString = handleNestedDocuments(buildQueryString());

    const requestBody: AdvancedSearchRequest = {
      query: {
        customQuery: queryString,
      },
      sort: {
        score: {
          order: "desc",
        },
        id: {
          order: "desc",
        },
      },
    };
    const fullQueryString = Object.keys(requestBody)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
      )
      .join("&");

    (async () => {
      const response = await fetch(
        `/api/search/advanced/${documentSelected}?${fullQueryString}&debug=true`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      console.debug("data", data);
      setQueryResults(data);
    })();
  };

  return (
    <>
      <h1>Query Builder Test Integration with Talent API</h1>
      <p>This is a test integration for the Query Builder with Talent API.</p>
      <label>
        Select document to query:
        <select
          id="document-select"
          onChange={onChangeDocumentSelect}
          value={documentSelected}
        >
          <>
            <option value="" disabled>
              Select a document...
            </option>
            {documents.map((document) => {
              return (
                <option key={document.id} value={document.id}>
                  {document.name}
                </option>
              );
            })}
          </>
        </select>
      </label>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 1 }}>
          <ClientOnly>
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={setQuery}
              controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
            />
          </ClientOnly>
          <h4>TALENT API Query Builder ElasticSearch Format</h4>
          <JsonView
            data={buildQueryString()}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
          <h4>TALENT API Query Builder After Handling Nested Documents</h4>
          <JsonView
            data={handleNestedDocuments(buildQueryString())}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </div>
        <div style={{ flex: 1, paddingLeft: "20px" }}>
          <button
            onClick={onClickExecuteQuery}
            className="btn btn-primary btn-lg"
          >
            Execute Query
          </button>
          <JsonView
            data={queryResults}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </div>
      </div>
    </>
  );
}
