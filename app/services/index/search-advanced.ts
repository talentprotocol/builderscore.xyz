import {
  API_BASE_URL,
  DEBUG_VIEW_UNLOCK_WORD,
  DEFAULT_HEADERS,
} from "@/app/config/api";

export const fetchSearchAdvanced = async ({
  documents,
  queryString,
}: {
  documents: string;
  queryString: string;
}) => {
  let processedQueryString = queryString;
  if (queryString.includes("debug=true")) {
    processedQueryString = queryString.replace(
      "debug=true",
      `debug=${DEBUG_VIEW_UNLOCK_WORD}`,
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/search/advanced/${documents}?${processedQueryString}`,
    {
      method: "GET",
      headers: DEFAULT_HEADERS,
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
