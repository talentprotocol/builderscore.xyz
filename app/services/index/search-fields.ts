import { API_BASE_URL, DEFAULT_HEADERS } from "@/app/config/api";
import { AdvancedSearchMetadataField } from "@/app/types/advancedSearchMetadataFields";

export const fetchSearchAdvancedMetadataFields = async ({
  documents,
}: {
  documents: string;
}): Promise<AdvancedSearchMetadataField[]> => {
  const response = await fetch(
    `${API_BASE_URL}/search/advanced/metadata/fields/${documents}/default`,
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
