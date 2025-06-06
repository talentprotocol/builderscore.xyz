import { Block } from "payload";

export const ProfilesBlock: Block = {
  slug: "profiles",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "config",
      type: "text",
    },
  ],
};
