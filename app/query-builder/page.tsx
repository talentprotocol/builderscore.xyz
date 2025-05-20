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

const Page = () => {
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
        const response = await fetch(`api/search/advanced/documents`);
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

  const buildQueryString = () => {
    return formatQuery(query, {
      format: "elasticsearch",
      parseNumbers: true,
      preserveValueOrder: true,
    });
  };

  const onClickExecuteQuery = () => {
    const queryString = buildQueryString();

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
        `/api/search/advanced/${documentSelected}?${fullQueryString}`,
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
              showShiftActions={true}
              controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
            />
          </ClientOnly>
          <h4>TALENT API Query</h4>
          <JsonView
            data={buildQueryString()}
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
};

export default Page;
