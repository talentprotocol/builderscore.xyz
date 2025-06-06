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
      name: "description",
      type: "text",
    },
    {
      name: "selectedView",
      type: "select",
      options: ["table", "chart"],
      defaultValue: "table",
    },
    {
      name: "query",
      type: "json",
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "order",
      type: "select",
      options: ["asc", "desc"],
      defaultValue: "desc",
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "pageIndex",
      type: "number",
      defaultValue: 0,
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "pageSize",
      type: "number",
      defaultValue: 10,
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "showPagination",
      type: "checkbox",
      defaultValue: true,
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "showTotal",
      type: "checkbox",
      defaultValue: true,
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "columnOrder",
      type: "array",
      fields: [{ name: "column", type: "text" }],
      defaultValue: COLUMN_ORDER.map((column) => ({ column })),
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "table",
      },
    },
    {
      name: "dateRange",
      type: "select",
      options: ["7d", "30d", "90d", "180d", "365d", "max"],
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "chart",
      },
    },
    {
      name: "dateInterval",
      type: "select",
      options: ["day", "week", "month"],
      defaultValue: "day",
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "chart",
      },
    },
    {
      name: "leftSeries",
      type: "array",
      fields: [{ name: "series", type: "json" }],
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "chart",
      },
    },
    {
      name: "rightSeries",
      type: "array",
      fields: [{ name: "series", type: "json" }],
      admin: {
        condition: (data, siblingData) => siblingData.selectedView === "chart",
      },
    },
  ],
};
