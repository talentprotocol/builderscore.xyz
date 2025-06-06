import { COLUMN_ORDER } from "@/app/lib/constants";
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
      name: "query",
      type: "json",
    },
    {
      name: "order",
      type: "select",
      options: ["asc", "desc"],
      defaultValue: "desc",
    },
    {
      name: "pageIndex",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "pageSize",
      type: "number",
      defaultValue: 10,
    },
    {
      name: "selectedView",
      type: "select",
      options: ["table", "chart"],
      defaultValue: "table",
    },
    {
      name: "showPagination",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "showTotal",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "columnOrder",
      type: "array",
      fields: [{ name: "column", type: "text" }],
      defaultValue: COLUMN_ORDER.map((column) => ({ column })),
    },
    {
      name: "dateRange",
      type: "date",
    },
    {
      name: "dateInterval",
      type: "select",
      options: ["day", "week", "month"],
      defaultValue: "day",
    },
    {
      name: "leftSeries",
      type: "array",
      fields: [
        { name: "key", type: "text" },
        { name: "name", type: "text" },
        { name: "dataProvider", type: "text" },
        { name: "color", type: "text" },
        {
          name: "type",
          type: "select",
          options: ["line", "column", "stacked-column", "area"],
        },
        { name: "cumulative", type: "checkbox" },
      ],
    },
    {
      name: "rightSeries",
      type: "array",
      fields: [
        { name: "key", type: "text" },
        { name: "name", type: "text" },
        { name: "dataProvider", type: "text" },
        { name: "color", type: "text" },
        {
          name: "type",
          type: "select",
          options: ["line", "column", "stacked-column", "area"],
        },
        { name: "cumulative", type: "checkbox" },
      ],
    },
  ],
};
