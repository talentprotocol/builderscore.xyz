import { Block } from "payload";

export const SectionBlock: Block = {
  slug: "section",
  fields: [
    {
      name: "gap",
      type: "select",
      options: [
        { label: "0", value: "0" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
      ],
      defaultValue: "2",
      admin: {
        description: "Spacing between blocks in this section",
      },
    },
    {
      name: "columns",
      type: "select",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "Auto", value: "auto" },
      ],
      defaultValue: "2",
      admin: {
        description: "Number of columns in this section",
      },
    },
    {
      type: "blocks",
      name: "blocks",
      label: "Blocks",
      blocks: [],
      blockReferences: ["profiles", "text"],
    },
  ],
};
