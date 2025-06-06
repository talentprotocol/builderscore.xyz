import { SectionBlock } from "@/app/components/blocks/SectionBlock/config";
import { slug } from "@/app/types/cms/slug";
import { CollectionConfig } from "payload";

export const Dashboard: CollectionConfig = {
  slug: "dashboard",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "blocks",
      type: "blocks",
      blocks: [SectionBlock],
    },
    slug({ trackingField: "title" }),
  ],
};
