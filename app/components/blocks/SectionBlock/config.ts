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
        description: "Spacing between blocks in this row",
      },
    },
    {
      name: "alignment",
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Space Between", value: "space-between" },
        { label: "Space Around", value: "space-around" },
        { label: "Space Evenly", value: "space-evenly" },
        { label: "Stretch", value: "stretch" },
      ],
      defaultValue: "start",
      admin: {
        description: "Vertical alignment of blocks in this row",
      },
    },
    {
      name: "wrap",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Allow blocks to wrap to new lines on smaller screens",
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
