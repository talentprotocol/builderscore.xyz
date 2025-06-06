import { RichText } from "@/app/components/cms/RichText";
import type { Text as TextProps } from "@/payload-types";

export const TextBlock = (props: TextProps) => {
  const { text } = props;

  return <RichText data={text} />;
};
