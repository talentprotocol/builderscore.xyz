import { RenderBlocks } from "@/app/components/blocks/render";
import { Section as SectionProps } from "@/payload-types";

export const SectionBlock = (props: SectionProps) => {
  const { blocks, gap = "2", alignment = "start", wrap = true } = props;

  const gapClasses = {
    "0": "gap-0",
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
  };

  const alignmentClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    "space-between": "justify-between",
    "space-around": "justify-around",
    "space-evenly": "justify-evenly",
    stretch: "justify-stretch",
  };

  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  const sectionClasses = `flex ${gapClasses[gap as keyof typeof gapClasses]} ${alignmentClasses[alignment as keyof typeof alignmentClasses]} ${wrapClass}`;

  return (
    <section className={sectionClasses}>
      <RenderBlocks blocks={blocks} />
    </section>
  );
};
