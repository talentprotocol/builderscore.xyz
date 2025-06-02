"use client";

import { ClientOnly } from "@/app/components/ClientOnly";
import { ENDPOINTS } from "@/app/config/api";
import {
  buildQueryString,
  handleNestedDocuments,
} from "@/app/lib/react-querybuilder-utils";
import { AdvancedSearchDocument } from "@/app/types/advancedSearchDocuments";
import { AdvancedSearchRequest } from "@/app/types/advancedSearchRequest";
import React from "react";
import { useEffect, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { QueryBuilder, RuleGroupType } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

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
          `${ENDPOINTS.localApi.talent.searchAdvancedMetadataFields}/${documentSelected}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );
        const metadataForFields = await response.json();
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
        const response = await fetch(
          ENDPOINTS.localApi.talent.searchAdvancedDocuments,
        );
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

  const onClickExecuteQuery = () => {
    const queryString = handleNestedDocuments(buildQueryString(query));

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
      page: 1,
      per_page: 10,
    };
    const fullQueryString = Object.keys(requestBody)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(JSON.stringify(requestBody[key as keyof AdvancedSearchRequest]))}`,
      )
      .join("&");

    (async () => {
      const response = await fetch(
        `${ENDPOINTS.localApi.talent.searchAdvanced}/${documentSelected}?${fullQueryString}&debug=true`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
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
            data={buildQueryString(query)}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
          <h4>TALENT API Query Builder After Handling Nested Documents</h4>
          <JsonView
            data={handleNestedDocuments(buildQueryString(query))}
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
