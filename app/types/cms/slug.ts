import { merge } from "lodash";
import { Field } from "payload";

type Slug = (
  options?: { trackingField?: string },
  overrides?: Partial<Field>,
) => Field;

export const slug: Slug = ({ trackingField = "title" } = {}, overrides) =>
  merge<Field, Partial<Field> | undefined>(
    {
      name: "slug",
      unique: true,
      type: "text",
      admin: {
        position: "sidebar",
        components: {
          Field: {
            path: "@/app/components/cms/SlugInput",
            exportName: "SlugInput",
            clientProps: {
              trackingField,
            },
          },
        },
      },
    },
    overrides,
  );
