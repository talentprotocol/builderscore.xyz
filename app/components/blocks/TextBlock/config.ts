import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";

export const TextBlock: Block = {
  slug: "text",
  fields: [
    {
      type: "richText",
      name: "text",
      required: true,
      editor: lexicalEditor({}),
    },
  ],
};
