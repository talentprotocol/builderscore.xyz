interface AdvancedSearchMetadataFieldValue {
  name: string;
  label: string;
}

interface AdvancedSearchMetadataField {
  name: string;
  label: string;
  inputType: string;
  valueEditorType: string;
  values: AdvancedSearchMetadataFieldValue[];
}

export type { AdvancedSearchMetadataFieldValue, AdvancedSearchMetadataField };
